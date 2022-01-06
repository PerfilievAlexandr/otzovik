export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class PageModel {
  _id: string;
  firstLevelCategory: TopLevelCategory;
  secondLevelCategory: string;
  title: string;
  category: string;
  hh?: {
    countNumber: number;
    juniorSalary: number;
    seniorSalary: number;
  };
  advantages: {
    title: string;
    description: string;
  }[];
  seoText: string;
  tagsTitle: string;
  tags: string[];
}
