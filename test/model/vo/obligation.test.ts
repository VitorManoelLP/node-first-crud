import Obligation from "../../../src/model/obligation";

test('should throw error when construct obligation without title', () => {
	expect(() => new Obligation('', 'description')).toThrow('Title must not to be empty');
});

test('should throw error when construct obligation without description', () => {
	expect(() => new Obligation('title', '')).toThrow('Description must not to be empty');
});