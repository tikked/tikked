import { expect } from 'chai';
import { Attribute } from '../src/domain/Attribute';
import { createDescription, createId, createName } from './Fixture';

describe('Attribute', () => {
  describe('constructor', () => {
    it('should be implemented', () => {
      // Act
      const attr = new Attribute(createId(), createName(), createDescription());

      // Assert (should not throw)
    });
  });

  describe('Id', () => {
    it('returns id passed in constructor', () => {
      const id = createId();
      const attr = new Attribute(id, createName(), createDescription());
      expect(attr.Id).to.eql(id);
    });
  });

  describe('Name', () => {
    it('returns name passed in constructor', () => {
      const name = createName();
      const attr = new Attribute(createId(), name, createDescription());
      expect(attr.Name).to.eql(name);
    });
  });

  describe('Description', () => {
    it('returns description passed in constructor', () => {
      const description = createDescription();
      const attr = new Attribute(createId(), createName(), description);
      expect(attr.Description).to.eql(description);
    });
  });
});
