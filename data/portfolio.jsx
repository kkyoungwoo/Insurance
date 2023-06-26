

const data = [
    {
        id: 1,
        title: "Huggl Power Pack",
        slug: 'huggl-power-pack',
        src: '/img/project/project3/1.jpg',

        category: ['induction'],
        description: 'Huggl is an induction charging.',
        overlay: 6
    },
    {
        id: 2,
        title: "Huggl Power Pack",
        slug: 'huggl-power-pack',
        src: '/img/project/project3/1.jpg',

        category: ['induction'],
        description: 'Huggl is an induction charging.',
        overlay: 6
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