export const quotes = [
  "Progress is built one task at a time.",
  "Small steps, every day, lead somewhere big.",
  "Clarity comes from writing things down.",
  "Great teams ship in small pieces.",
  "Done is better than perfect.",
]

export const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)]
