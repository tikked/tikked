import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { RestApiStream } from '../src/persistency/RestApiStream';
chaiUse(sinonChai);
chaiUse(chaiAsPromised);

describe('RestApiStream', () => {
  describe('constructor', () => {
    context('when called with empty url argument', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new RestApiStream('');
        })
          // Assert
          .to.throw('empty');
      });
    });

    context('when called with invalid url argument', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new RestApiStream('this is not a url');
        })
          // Assert
          .to.throw('URL');
      });
    });

    context('when called with valid url argument', () => {
      it('should throw an error', () => {
        // Act
        expect(() => {
          const res = new RestApiStream('http://localhost');
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
