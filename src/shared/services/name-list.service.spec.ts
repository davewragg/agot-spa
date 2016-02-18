import {NameListService} from './name-list.service';

export function main() {
  describe('NameListService Service', () => {
    let nameList;

    beforeEach(() => {
      nameList = new NameListService;
    });

    it('should return the list of names', () => {
      let names = nameList.get();
      expect(names).toEqual(jasmine.any(Array));
    });
  });
}
