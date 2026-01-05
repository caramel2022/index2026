export interface CompetencyRow {
  code: string;
  description: string;
  mastery: number; // 0 to 100
  students: string;
}

export const INITIAL_DATA: CompetencyRow[] = [
  {
    code: 'PO1',
    description: 'المشاركة في حوار بتوظيف الأفعال الكلامية المدرسة',
    mastery: 0,
    students: ''
  },
  {
    code: 'PO2',
    description: 'أخذ الكلمة لإنتاج نصوص شفهية بغرض السرد أو الوصف أو إبداء الرأي أو التوجيه انطلاقا من مشاهد',
    mastery: 0,
    students: ''
  },
  {
    code: 'V1',
    description: 'فهم وإنتاج مفردات من المعجم المجالي المدرس انطلاقا من مشاهد أو تعاريف أو سياقات',
    mastery: 0,
    students: ''
  },
  {
    code: 'V2',
    description: 'توظيف استراتيجيات المفردات لفهم وتوليد كلمات',
    mastery: 0,
    students: ''
  },
  {
    code: 'CO1',
    description: 'استرجاع واستنتاج معلومات صريحة وضمنية واردة في نص مسموع',
    mastery: 0,
    students: ''
  },
  {
    code: 'CO2',
    description: 'إعادة إنتاج النص المسموع موظفا مهارات التركيب: التعليق، التلخيص، الإكمال',
    mastery: 0,
    students: ''
  },
  {
    code: 'LF2',
    description: 'قراءة نص من حوالي 40 إلى 60 كلمة، مشكولاً شكلاً تاماً بدقة واسترسال',
    mastery: 0,
    students: ''
  },
  {
    code: 'LC1',
    description: 'استخراج معلومات صريحة من نصوص أدبية ومعلوماتية بتوظيف استراتيجيات الفهم',
    mastery: 0,
    students: ''
  },
  {
    code: 'LC2',
    description: 'استنتاج معلومات ضمنية من نصوص أدبية ومعلوماتية بتوظيف استراتيجيات الفهم',
    mastery: 0,
    students: ''
  },
  {
    code: 'PE1',
    description: 'التعبير بكتابة جمل أو فقرة مُوَظِّفاً مهارات: الإكمال، التركيب، التعليق، التوسيع',
    mastery: 0,
    students: ''
  },
  {
    code: 'OL1',
    description: 'توظيف الظواهر اللغوية والإملائية لتركيب جمل مُعْتَمِداً على المحاكاة أو القرار النحوي',
    mastery: 0,
    students: ''
  }
];