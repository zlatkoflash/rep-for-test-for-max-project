/**
 * Interface describing the geographical coordinates.
 */
interface Geo {
    lat: string;
    lng: string;
}

/**
 * Interface describing the user's address structure.
 */
interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo; // Nested interface
}

/**
 * Interface describing the user's company details.
 */
interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

/**
 * The main interface for the User object.
 */
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address; // Nested interface
    phone: string;
    website: string;
    company: Company; // Nested interface
}