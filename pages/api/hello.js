// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  let data = [];
  fetch(
    `https://sandbox-api.brewerydb.com/v2/beers/?key=${breweryDBKey}&p=${req.query.page}`
  )
    .then(response => response.json())
    .then(beers => {
      beers.data.map(beer =>
        data.push({
          name: beer.name,
          abv: beer.abv,
          ibu: beer.ibu,
          category: beer.style ? beer.style.categoryId : null,
          available: beer.availableId
            ? beer.availableId
            : beer.available
            ? beer.available.id
            : 1
        })
      );
      res.json({
        data,
        currentPage: beers.currentPage,
        numberOfPages: beers.numberOfPages
      });
    })
    .catch(error => console.log(error));
}
