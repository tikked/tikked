import { expect, use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { of } from 'rxjs';
import { SinonStub, stub } from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'ts-sinon';
import { ApplicationEnvironment } from 'tikked-core';
import { Coder, DataStream, StreamFactory } from '../src/persistency';
import { ApplicationEnvironmentRepository } from '../src/persistency/ApplicationEnvironmentRepository';
import { createApplicationEnvironment, createId } from './Fixture';
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
            sinon.stubInterface<StreamFactory<DataStream>>({}),
            sinon.stubInterface<Coder<string>>({}),
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
      beforeEach(() => {
        // Arrange
        id = createId();
        appEnv = createApplicationEnvironment(id);
        stubbedErrorHandler = stub();
        stubbedStream = sinon.stubInterface<DataStream>({ read: of('appEnv') });
        stubbedStreamFactory = sinon.stubInterface<StreamFactory<DataStream>>({
          create: stubbedStream
        });
        stubbedCoder = sinon.stubInterface<Coder<string>>({ decode: appEnv });
        repo = new ApplicationEnvironmentRepository(
          stubbedStreamFactory,
          stubbedCoder,
          stubbedErrorHandler
        );
      });
      describe('when called with id of persisted application environment', () => {
        it('should return corresponding application environment', async () => {
          // Act
          const res = await repo.get(id).toPromise();
          // Assert
          expect(res).to.be.equal(appEnv);
        });
      });
      describe('when called with non-existent id', () => {
        it('should throw an error', () => {
          const expectedMessage = 'some-message';
          stubbedStreamFactory.create = () => {
            throw new Error(expectedMessage);
          };
          // Act
          return (
            expect(repo.get(id).toPromise())
              // Assert
              .to.be.rejectedWith(Error, expectedMessage)
          );
        });
      });
      describe('when called with same id multiple times', () => {
        it('should only create from factory once', async () => {
          // Act
          await repo.get(id).toPromise();
          await repo.get(id).toPromise();
          // Assert
          expect(stubbedStreamFactory.create).to.be.calledOnce;
        });
      });
      describe('when called with id that causes decoder to throw', () => {
        it('should throw an error', () => {
          const expectedMessage = 'some-message';
          stubbedCoder.decode = stub().throws(new Error(expectedMessage));
          // Act
          return (
            expect(repo.get(id).toPromise())
              // Assert
              .to.be.rejectedWith(Error, expectedMessage)
          );
        });
      });
      describe('when called with id that causes decoder to throw on second call', () => {
        let expectedMessage: string;
        let decode: SinonStub;
        beforeEach(() => {
          expectedMessage = 'some-message';
          stubbedStream.read = stub().returns(of('1', '2'));
          decode = stub();
          stubbedCoder.decode = decode;
          decode.onCall(0).returns(appEnv);
          decode.onCall(1).throws(new Error(expectedMessage));
        });
        it('should call error handler once', async () => {
          await repo.get(id).toPromise();
          expect(stubbedErrorHandler).to.be.calledOnce;
          expect(stubbedErrorHandler.getCall(0).args[0])
            .to.be.an('Error')
            .with.property('message', expectedMessage);
        });
      });
    });
  });
});
