

const data = [   
    {
        id: 1,
        title: "외국인 고용 DB",
        slug: 'free_headhunting',
        src: '/img/work/free_headhunting_main.jpg',

        category: ['기업 무료 서비스'],
        description: '외국인 합법 고용 컨설팅 보고서 제공',
        overlay: 4
    },
    {
        id: 2,
        title: "맞춤형 이력서 전달",
        slug: 'paid_headhunting',
        src: '/img/work/paid_headhunting_main.jpg',

        category: ['기업 무료 서비스'],
        description: '합법 취업이 가능한 외국인 이력서 제공',
        overlay: 5
    },
    {
        id: 3,
        title: "외국인 취업 허가",
        slug: 'remote_work',
        src: '/img/work/remote_work.jpg',

        category: ['기업 무료 서비스'],
        description: '취업비자 발급 가이드북 무료 제공',
        overlay: 3
    },
    /*{
        id: 4,
        title: "기업 컨설팅",
        slug: 'consulting',
        src: '/img/work/consulting_main.jpg',

        category: ['insurance'],
        description: '세금절감, 경정청구, 법정의무교육 등 법인기업 컨설팅',
        overlay: 6
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
        overlay: 5
    }*/
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