# beer-graphics-next
A d3.js visualization for BreweryDB.

This fullstack Next.js app generates a unique image for each beer in the database using d3 to represent the beer's characteristics. For example:
    - the image color represents the type of beer
    - the shape of the flower petals relate to the beer's availability
    - the size of the image is proportional to its ABV
    - the number of flower petals is logarithmically proportional to the beer's IBU (some are very bitter)

The paginated data is fetched from BreweryDB.

See the app live at https://beer-graphics.vercel.app/.