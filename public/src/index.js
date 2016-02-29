import m from 'mithril';
import he from 'he';
let App = {};

App.view = ( c, props ) => {
  //const { movies } = props;
  const movieList = [
    {
      "name":    "Blue Jasmine",
      "year":    [ "(2013)", "(2014)" ],
      "imdbURL": "http://www.imdb.com/title/tt2334873/"
    }, {
      "name":    "A nagy f&#xFC;zet",
      "year":    [ "(2013)", "(2014)" ],
      "imdbURL": "http://www.imdb.com/title/tt2324384/"
    }, {
      "name":    "Only Lovers Left Alive",
      "year":    [ "(2013)", "(2014)" ],
      "imdbURL": "http://www.imdb.com/title/tt1714915/"
    } ];
  const movies = movieList.map( ( m )=> Object.assign( m, { name: he.decode( m.name ) } ) );
  return (
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3">
            <h4>Movies</h4>
            <div class="list-group">
              {movies.map( ( movie ) => (
                  <a class="list-group-item" href="#">
                    {movie.name}<i class="fa fa-chevron-circle-right" style="float: right;"></i>
                  </a>
              ) )  }
            </div>
          </div>
        </div>
        <div>tutuyutu!</div>
      </div>
  )
}
export default App;
