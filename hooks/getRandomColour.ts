const colours = [
    '#667080',
    '#E6194B',
    '#F58231',
    '#CCB100',
    '#3CB44B',
    '#4747FF',
    '#911EB4',
    '#F032E6',
    '#808000',
    '#8F4700'
]
const getRandomColour = () => {
    return colours[Math.floor(Math.random() * colours.length)]
}

export default getRandomColour