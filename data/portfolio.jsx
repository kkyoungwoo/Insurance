

const data = [   
    {
        id: 1,
        title: "무료 헤드헌팅",
        slug: 'free_headhunting',
        src: '/img/work/free_headhunting_main.jpg',

        category: ['headhunting'],
        description: '합법취업 상근 헤드헌팅 외국 일반인력',
        overlay: 2
    },
    {
        id: 2,
        title: "유료 헤드헌팅",
        slug: 'paid_headhunting',
        src: '/img/work/paid_headhunting_main.jpg',

        category: ['headhunting'],
        description: '합법취업 상근 헤드헌팅 외국 전문인력',
        overlay: 2
    },
    {
        id: 3,
        title: "리모트 워크",
        slug: 'remote_work',
        src: '/img/work/remote_work_main.jpg',

        category: ['headhunting'],
        description: '비상주(비대면) 개발자 및 단순업무 외국 인력',
        overlay: 2
    },
    {
        id: 4,
        title: "기업 컨설팅",
        slug: 'consulting',
        src: '/img/work/consulting_main.jpg',

        category: ['insurance'],
        description: '세금절감, 경정청구, 법정의무교육 등 법인기업 컨설팅',
        overlay: 2
    },
    {
        id: 5,
        title: "보험 컨설팅",
        slug: 'insurance',
        src: '/img/work/insurance_main.jpg',

        category: ['insurance'],
        description: '단체보험, 자동차보험, 개인보험, 리쿠르팅 및 DB 영업',
        overlay: 2
    },
    {
        id: 6,
        title: "기타 수수료",
        slug: 'etc',
        src: '/img/work/etc_main.jpg',

        category: ['etc'],
        description: '외국인을 대상으로한 알뜰폰, 부동산 등 기타 영업툴',
        overlay: 2
    }
]

export const getPortfolioData = () => data;

export const getPortfolioItem = (value, whereName = "slug") => {
    return data.find(item => item[whereName] === value);
};
export const getPortfolioLink = (item) => {
    if (item)
        return item.slug && '/works/' + item.slug;

    return '';
};