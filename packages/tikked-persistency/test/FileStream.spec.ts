import { fail } from 'assert';
import { existsSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import { expect, use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Observable, Subscription } from 'rxjs';
import { fake, SinonSpy, SinonStub, spy, stub } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { FileStream } from '../src/persistency/FileStream';
import { becomesTrue, createApplicationEnvironment, createString } from './Fixture';
chaiUse(sinonChai);
chaiUse(chaiAsPromised);

describe('FileStream', () => {
  describe('constructor', () => {
    context('when called with empty file path', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new FileStream('');
        })
          // Assert
          .to.throw('empty');
      });
    });
  });

  describe('read', () => {
    context('given mocked loader and watcher', () => {
      let stream: FileStream;
      let fileName: string;
      let fileContent: string;
      let load: SinonStub;
      let watch: SinonStub;
      let watchClose: SinonSpy;
      let write: SinonSpy;
      let next: SinonSpy;
      let error: SinonSpy;
      let complete: SinonSpy;
      beforeEach(async () => {
        fileName = 'some-test-file';
        fileContent = 'some content';
        load = stub().resolves(fileContent);
        watchClose = spy();
        watch = stub().returns({ close: watchClose });
        write = fake.resolves(undefined);
        next = spy();
        error = spy();
        complete = spy();
        stream = new FileStream(fileName, load, watch, write);
      });
      context('when subscriber is attached', () => {
        let sub: Subscription;
        beforeEach(() => {
          sub = stream.read().subscribe({ next, error, complete });
        });
        afterEach(() => {
          sub.unsubscribe();
        });
        it('should trigger content of file to be read', done => {
          setTimeout(() => {
            expect(load).to.be.calledOnce;
            expect(load).to.be.calledOnceWith(fileName);
            done();
          });
        });
        it('should trigger subscribed observable', done => {
          setTimeout(() => {
            expect(next).to.be.calledOnce;
            expect(next).to.be.calledOnceWith(fileContent);
            done();
          });
        });
        it('should not trigger error/completed on subscribed observable', done => {
          setTimeout(() => {
            expect(error).to.not.be.called;
            expect(complete).to.not.be.called;
            done();
          });
        });
      });
      context('when subscriber is attached multiple times', () => {
        let sub1: Subscription;
        let sub2: Subscription;
        beforeEach(() => {
          sub1 = stream.read().subscribe({ next, error, complete });
          sub2 = stream.read().subscribe({ next, error, complete });
        });
        afterEach(() => {
          sub1.unsubscribe();
          sub2.unsubscribe();
        });
        it('should only read file once', done => {
          setTimeout(() => {
            expect(load).to.be.calledOnce;
            expect(load).to.be.calledOnceWith(fileName);
            done();
          });
        });
        it('should trigger subscribed observable multiple times', done => {
          setTimeout(() => {
            expect(next).to.be.calledTwice;
            expect(next).to.be.calledWith(fileContent);
            done();
          });
        });
        it('should not trigger error/completed on subscribed observable', done => {
          setTimeout(() => {
            expect(error).to.not.be.called;
            expect(complete).to.not.be.called;
            done();
          });
        });
      });
      context('when file watcher is triggered', () => {
        let sub: Subscription;
        let secondFileContent;
        beforeEach(() => {
          secondFileContent = 'some other content';
          load.onCall(0).resolves(fileContent);
          load.onCall(1).resolves(secondFileContent);
          sub = stream.read().subscribe({ next, error, complete });
          watch.callArgWith(1, 'change');
        });
        afterEach(() => {
          sub.unsubscribe();
        });
        it('should trigger reload of file', done => {
          setTimeout(() => {
            expect(load).to.be.calledTwice;
            expect(load.alwaysCalledWith(fileName)).to.be.true;
            done();
          });
        });
        it('should trigger subscribed observable with the new content after the old', done => {
          setTimeout(() => {
            expect(next).to.be.calledTwice;
            expect(next.getCall(0).args[0]).to.be.equal(fileContent);
            expect(next.getCall(1).args[0]).to.be.equal(secondFileContent);
            done();
          });
        });
      });
      context('when subscriber unsubscribes', () => {
        beforeEach(() => {
          const sub = stream.read().subscribe({ next, error, complete });
          sub.unsubscribe();
        });
        it('should trigger the watcher token to be closed', () => {
          expect(watchClose).to.calledOnce;
        });
      });
    });
    context('given existing file', () => {
      let stream: FileStream;
      let fileName: string;
      let filePath: string;
      let fileContent: string;
      beforeEach(async () => {
        fileName = 'some-file';
        fileContent = 'some content';
        filePath = join(__dirname, fileName);
        await fsPromises.writeFile(filePath, fileContent);
        stream = new FileStream(filePath);
      });
      afterEach(async () => {
        await fsPromises.unlink(filePath);
      });
      context('when stream is initially read', () => {
        let observable: Observable<string>;
        beforeEach(() => {
          observable = stream.read();
        });
        it('should get back the file content through observable', done => {
          const sub = observable.subscribe({
            next: val => {
              expect(val).to.be.equal(fileContent);
              sub.unsubscribe();
              done();
            }
          });
        });
      });
      context('when file is changed', () => {
        let newContent: string;
        let next: SinonSpy;
        let sub: Subscription;
        beforeEach(async () => {
          next = spy();
          sub = stream.read().subscribe({ next });
          newContent = createString();
          await becomesTrue(() => next.calledOnce);
          await stream.write(newContent);
        });
        afterEach(() => {
          sub.unsubscribe();
        });
        it('should get back the file content through observable', async () => {
          await becomesTrue(() => next.callCount >= 2);
          expect(next).to.be.calledTwice;
          expect(next.getCall(0).args[0]).to.be.equal(fileContent);
          expect(next.getCall(1).args[0]).to.be.equal(newContent);
        });
      });
    });
    context('given non-existing file', () => {
      let stream: FileStream;
      let fileName: string;
      let filePath: string;
      let fileContent: string;
      beforeEach(async () => {
        fileName = 'some-non-existent-file';
        fileContent = 'some content';
        filePath = join(__dirname, fileName);
        stream = new FileStream(filePath);
      });
      afterEach(async () => {
        if (existsSync(filePath)) {
          await fsPromises.unlink(filePath);
        }
      });
      context('when stream is initially read', () => {
        let sub: Subscription;
        let next: SinonSpy;
        let error: SinonSpy;
        beforeEach(() => {
          next = spy();
          error = spy();
          sub = stream.read().subscribe({ next, error });
        });
        afterEach(() => {
          sub.unsubscribe();
        });
        it('should throw error', async () => {
          await becomesTrue(() => error.callCount >= 1);
          expect(next).to.not.be.called;
          expect(error).to.be.calledOnce;
        });
      });
      context('when stream is subsequently read after initial error and file change', () => {
        let sub: Subscription;
        let next: SinonSpy;
        let error: SinonSpy;
        beforeEach(async () => {
          next = spy();
          error = spy();
          const subTemp = stream.read().subscribe({ next, error });
          await becomesTrue(() => error.callCount >= 1);
          await fsPromises.writeFile(filePath, fileContent);
          subTemp.unsubscribe();
          sub = stream.read().subscribe({ next, error });
        });
        afterEach(async () => {
          sub.unsubscribe();
        });
        it('should get the file content of the newly saved file', async () => {
          await becomesTrue(() => next.callCount >= 1);
          expect(next).to.be.calledOnce;
          expect(next).to.be.calledWith(fileContent);
          expect(error).to.be.calledOnce;
        });
      });
    });
  });

  describe('write', () => {
    context('given a file stream with mocked writer', () => {
      let stream: FileStream;
      let filePath: string;
      let fileContent: string;
      let load: SinonStub;
      let watch: SinonStub;
      let watchClose: SinonSpy;
      let write: SinonSpy;
      let next: SinonSpy;
      let error: SinonSpy;
      let complete: SinonSpy;
      beforeEach(() => {
        filePath = 'some-path';
        fileContent = 'some content';
        load = stub().resolves(fileContent);
        watchClose = spy();
        watch = stub().returns({ close: watchClose });
        write = fake.resolves(undefined);
        next = spy();
        error = spy();
        complete = spy();
        stream = new FileStream(filePath, load, watch, write);
      });
      context('when write is executed with new content', () => {
        let newContent: string;
        beforeEach(() => {
          newContent = 'some new content';
          stream.write(newContent);
        });
        it('should called underlying writer', () => {
          expect(write).to.be.calledOnce;
          expect(write).to.be.calledOnceWith(filePath, newContent);
        });
      });
    });
  });
});
