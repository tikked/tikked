import { expect, use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { WebsocketApiStream } from '../src/persistency/WebsocketApiStream';
chaiUse(sinonChai);
chaiUse(chaiAsPromised);

describe('WebsocketApiStream', () => {
  describe('constructor', () => {
    context('when called with empty url argument', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new WebsocketApiStream('');
        })
          // Assert
          .to.throw('empty');
      });
    });

    context('when called with invalid url argument', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new WebsocketApiStream('this is not a url');
        })
          // Assert
          .to.throw('URL');
      });
    });

    context('when called with valid url argument', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new WebsocketApiStream('ws://localhost');
        })
          // Assert
          .to.not.throw();
      });
    });
  });
  describe('read', () => {
    // TODO: Implement
  });
});
