'use client'

import { User } from '@/interface/interface';
import { createContext, useContext, useReducer, useMemo, useEffect, useState } from 'react';

// --- 1. Define Types & Initial State ---

const initialState = {
    searchData: [],          // Array to hold the fetched results (any array)
    fetchState: 'loading',    // 'loading' | 'error' | 'loaded'
    searchString: '',        // The user's input search string
    countPages: 0,
    pageIndex: 1,            // Current page number (1-based index)
    itemsPerPage: 5,         // Fixed items per page
};

// --- 2. Create Single Context Object ---

// Initialize context with a default value of undefined
const SearchContext = createContext({
    state: initialState,
    actions: {
        setSearchData: (data: User[]) => { },
        setFetchState: (state: string) => { },
        setSearchString: (str: string) => { },
        setPageIndex: (index: number) => { },
        nextPage: () => { },
        prevPage: () => { },
    },
});


// --- 3. Define Actions and Reducer ---

const ACTIONS = {
    SET_DATA: 'SET_DATA',
    SET_FETCH_STATE: 'SET_FETCH_STATE',
    SET_SEARCH_STRING: 'SET_SEARCH_STRING',
    SET_PAGE_INDEX: 'SET_PAGE_INDEX',
};

function searchReducer(state: any, action: any) {
    switch (action.type) {
        case ACTIONS.SET_DATA:

            // const countPages = Math.ceil(action.payload.length / state.itemsPerPage);

            return {
                ...state,
                searchData: action.payload.data,
                countPages: action.payload.countPages,
                fetchState: 'loaded',
            };
        case ACTIONS.SET_FETCH_STATE:
            return {
                ...state,
                fetchState: action.payload,
            };
        case ACTIONS.SET_SEARCH_STRING:
            return {
                ...state,
                searchString: action.payload,
                pageIndex: 1, // Reset to page 1 when search string changes
            };
        case ACTIONS.SET_PAGE_INDEX:
            return {
                ...state,
                // Ensure the index is at least 1
                pageIndex: Math.max(1, action.payload),
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// --- 4. The Provider Component ---

export function SearchProvider({ children }: { children: React.ReactNode }) {

    const [loadedData, set_loadedData] = useState<User[]>([]);
    const [state, dispatch] = useReducer(searchReducer, initialState);
    const {
        searchData,
        fetchState,
        searchString,
        pageIndex,
        itemsPerPage,
        countPages,
    } = state;

    // Memoize utility functions (actions) to avoid re-creation on every render
    const actions = useMemo(() => ({
        setSearchData: (data: User[]) => dispatch({ type: ACTIONS.SET_DATA, payload: data }),
        setFetchState: (state: string) => dispatch({ type: ACTIONS.SET_FETCH_STATE, payload: state }),
        setSearchString: (str: string) => dispatch({ type: ACTIONS.SET_SEARCH_STRING, payload: str }),
        setPageIndex: (index: number) => dispatch({ type: ACTIONS.SET_PAGE_INDEX, payload: index }),
        // Helper to move to the next page
        nextPage: () => dispatch({ type: ACTIONS.SET_PAGE_INDEX, payload: state.pageIndex + 1 }),
        // Helper to move to the previous page
        prevPage: () => dispatch({ type: ACTIONS.SET_PAGE_INDEX, payload: state.pageIndex - 1 }),
    }), [dispatch, state.pageIndex]);


    // Combine state and actions into a single object for the context value
    const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

    const dataObject = (data: User[]): {
        data: User[],
        countPages: number
    } => {
        return {
            data: data.slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage),
            countPages: Math.ceil(data.length / itemsPerPage),
        }
    }

    const __init_fetch_data = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            set_loadedData(data);
            dispatch({ type: ACTIONS.SET_DATA, payload: dataObject(data) });
            dispatch({ type: ACTIONS.SET_FETCH_STATE, payload: 'loaded' });
            console.log("loadeddata:", data);
        } catch (error) {
            console.error('Error fetching data:', error);
            dispatch({ type: ACTIONS.SET_FETCH_STATE, payload: 'error' });
        }
    }

    useEffect(() => {
        // init fetch data
        __init_fetch_data();
    }, [])

    useEffect(() => {
        if (searchString === "") {
            dispatch({ type: ACTIONS.SET_DATA, payload: dataObject(loadedData) });
        } else {
            const filteredData = loadedData.filter((item: User) => {
                // return // JSON.stringify(item).toLowerCase().includes(searchString.toLowerCase()); 
                return item.name.toLowerCase().includes(searchString.toLowerCase()) || item.username.toLowerCase().includes(searchString.toLowerCase()) || item.email.toLowerCase().includes(searchString.toLowerCase());
            });
            dispatch({ type: ACTIONS.SET_DATA, payload: dataObject(filteredData) });
        }
    }, [searchString, pageIndex])

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
}

// --- 5. Custom Hook for Consumption ---

// Hook to access the current search state and actions
export function useSearch() {
    const context = useContext(SearchContext);

    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }

    return context;
}