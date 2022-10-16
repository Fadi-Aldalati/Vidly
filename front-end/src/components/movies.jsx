import {getMovies} from '../services/movieService';
import { getGenres } from '../services/genreService';
import ListGroup from './common/listGroup';
import React, { Component } from 'react';
import {toast} from 'react-toastify';
import MoviesTable from './moviesTable';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import { Link } from 'react-router-dom';
import SearchForm from './searchForm';
import _, { filter } from 'lodash';
import { deleteMovie } from '../services/movieService';

class Movies extends Component {
    state = { 
        movies: [],
        genres:[],
        currentPage:1,
        pageSize: 4,
        searchQuery:"",
        selectedGenre:null, 
        sortColumn: { path :"title",order :"asc"}
    }; 
    async componentDidMount() {
        const {data} = await getGenres();
        const genres=[{name:"All genres",_id:""}, ...data];

        const {data:movies} =await getMovies();
        this.setState({ movies, genres });
    }
    handleDelete = async  movie => {
        const originalMovies = this.state.movies;
        const movies = originalMovies.filter(m => m._id !== movie._id);
        this.setState({ movies });
        try{
        await deleteMovie(movie._id);
        }
        catch (ex){
            if(ex.response && ex.response.status === 404){
                toast.error('This movie has already been deleted.');
                
                this.setState({movies:originalMovies});
            }
        }
    };
    handleLike = movie => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
    };
    handlePageChange = page => {
        this.setState({ currentPage: page }); 
    };
    handleGenreSelect = genre => {
        this.setState({ selectedGenre : genre ,searchQuery:"",currentPage : 1}); 
    }
    handleSort = sortColumn => {
       
        this.setState({ sortColumn });
    };
    handleSearch = query =>{
        this.setState({selectedGenre:null,searchQuery:query,currentPage:1})
    };
    getPagedData = () => {
         const { pageSize, currentPage, selectedGenre ,searchQuery,sortColumn,movies:allMovies} = this.state;
            let filtered=allMovies;
            if (searchQuery)
            filtered=allMovies.filter(m => m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
            else if (selectedGenre && selectedGenre._id)
            filtered=allMovies.filter(m=> m.genre._id === selectedGenre._id);

            const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

            const movies = paginate(sorted, currentPage, pageSize);
            return { totalCount: filtered.length, data: movies };
        };
    render() {
        const { pageSize,searchQuery, currentPage,sortColumn} = this.state;
        const {length:count} =this.state.movies;
        const {user} = this.props;
        if (count === 0) 
            return <p>There are no movies in the database.</p>; 
        
        const { totalCount, data:movies } = this.getPagedData();
        return (
            <React.Fragment>
                <div className='container'>
                    <div className='row'>
                        <div className='col-3'>
                            <ListGroup
                                items={this.state.genres}
                                selectedItem={this.state.selectedGenre}
                                onItemSelect={this.handleGenreSelect}
                            />
                    </div>
            
                    <div className='col'>
                   { user && (<Link to="/movies/new" className='btn btn-primary' style={{marginBottom:20}}>New Movie</Link>)}
        <p>Showing {totalCount} movies in the database. </p>
                            <SearchForm
                                value={searchQuery}
                                onChange={this.handleSearch}
                            />
                            <MoviesTable
                                movies={movies}
                                onLike={this.handleLike}
                                onDelete={this.handleDelete}
                                onSort={this.handleSort}
                                sortColumn={sortColumn}
                                
                            />
                <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                            />
                            </div>
                    </div>
                    </div>
        </React.Fragment>
        );
    }
}
 
export default Movies;