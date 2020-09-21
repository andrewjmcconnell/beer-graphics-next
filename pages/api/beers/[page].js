// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const breweryDBKey = "83e24a32db9e38953e1606025dbd9bae";

export default (req, res) => {
    const {
      query: { page }
    } = req;
  
    let data = [];
    fetch(
      `https://sandbox-api.brewerydb.com/v2/beers/?key=${breweryDBKey}&p=${page}`
    )
      .then(response => response.json())
      .then(beers => {
        beers.data.map(beer =>
          data.push({
            name: beer.name,
            abv: beer.abv ? parseFloat(beer.abv) : null,
            ibu: beer.ibu ? parseFloat(beer.ibu) : null,
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
  };
  