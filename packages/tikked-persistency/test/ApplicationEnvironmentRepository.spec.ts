import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { firstValueFrom, lastValueFrom, Observable, of } from 'rxjs';
import { SinonStub, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import {stubInterface} from '@salesforce/ts-sinon';
import * as sinon from 'sinon';
import { ApplicationEnvironment } from '@tikked/core';
import { Coder, DataStream, StreamFactory } from '../src/persistency';
import { ApplicationEnvironmentRepository } from '../src/persistency/ApplicationEnvironmentRepository';
import { createApplicationEnvironment, createId } from './Fixture';
import { triggerAsyncId } from 'async_hooks';
chaiUse(sinonChai);
chaiUse(chaiAsPromised);

describe('ApplicationEnvironmentRepository', () => {
  describe('constructor', () => {
    describe('given error handler is undefined', () => {
      describe('when called', () => {
        let repo: ApplicationEnvironmentRepository;
        beforeEach(() => {
          // Act
          repo = new ApplicationEnvironmentRepository(
            stubInterface<StreamFactory<DataStream>>(sinon),
            stubInterface<Coder<string>>(sinon),
            undefined
          );
        });
        it('should contruct repo with default error handler', () => {
          // Assert
          expect(repo).to.not.be.undefined;
        });
      });
    });
  });
  describe('get', () => {
    describe('given a persisted application environment', () => {
      let id: string;
      let appEnv: ApplicationEnvironment;
      let stubbedStream: DataStream;
      let stubbedErrorHandler: SinonStub;
      let stubbedStreamFactory: StreamFactory<DataStream>;
      let stubbedCoder: Coder<string>;
      let repo: ApplicationEnvironmentRepository;
      let create: (inId: string) => DataStream<string>
      let decode: (code: string) => ApplicationEnvironment
      let read: () => Observable<string>

      beforeEach(() => {
        // Arrange
        id = createId();
        appEnv = createApplicationEnvironment(id);
        stubbedErrorHandler = stub();
        read = () => of('appEnv')
        stubbedStream = stubInterface<DataStream>(sinon,{ read: () => read() });
        create = () => stubbedStream;
        stubbedStreamFactory = stubInterface<StreamFactory<DataStream>>(sinon,{
          create: (inId) => create(inId)
        });
        decode = () => appEnv
        stubbedCoder = stubInterface<Coder<string>>(sinon,{ decode: (code) => decode(code) });
        repo = new ApplicationEnvironmentRepository(
          stubbedStreamFactory,
          stubbedCoder,
          stubbedErrorHandler
        );
      });
      describe('when called with id of persisted application environment', () => {
        it('should return corresponding application environment', async () => {
          // Act
          const res = await firstValueFrom(repo.get(id));
          // Assert
          expect(res).to.be.equal(appEnv);
        });
      });
      describe('when called with non-existent id', () => {
        it('should throw an error', () => {
          const expectedMessage = 'some-message';
          create = () => {throw new Error(expectedMessage)};
          // Act
          return (
            expect(firstValueFrom(repo.get(id+'x')))
              // Assert
              .to.be.rejectedWith(Error, expectedMessage)
          );
        });
      });
      describe('when called with same id multiple times', () => {
        it('should only create from factory once', async () => {
          // Act
          await firstValueFrom(repo.get(id));
          await firstValueFrom(repo.get(id));
          // Assert
          expect(stubbedStreamFactory.create).to.be.calledOnce;
        });
      });
      describe('when called with id that causes decoder to throw', () => {
        it('should throw an error', () => {
          const expectedMessage = 'some-message';
          decode = () => {throw new Error(expectedMessage)};
          // Act
          return (
            expect(firstValueFrom(repo.get(id)))
              // Assert
              .to.be.rejectedWith(Error, expectedMessage)
          );
        });
      });
      describe('when called with id that causes decoder to throw on second call', () => {
        let expectedMessage: string;
        beforeEach(() => {
          expectedMessage = 'some-message';
          read = stub().returns(of('1', '2'));
          const temp = stub();
          temp.onCall(0).returns(appEnv);
          temp.onCall(1).throws(new Error(expectedMessage));
          decode = temp;
        });
        it('should call error handler once', async () => {
          await lastValueFrom(repo.get(id));
          expect(stubbedErrorHandler).to.be.calledOnce;
          expect(stubbedErrorHandler.getCall(0).args[0])
            .to.be.an('Error')
            .with.property('message', expectedMessage);
        });
      });
    });
  });
});
