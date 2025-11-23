import '@testing-library/jest-dom';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: jest.fn(() => []),
}));

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    })),
});

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
    })
);

Object.defineProperty(window, 'location', {
    value: {
        href: 'http://localhost:3002',
        pathname: '/',
        search: '',
        assign: jest.fn(),
        reload: jest.fn(),
    },
    writable: true,
});

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// next/image mock
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
        return <img {...props} />;
    },
}));

// next/link mock
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }) => <a href={href}>{children}</a>,
}));

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8888';
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'mock-google-client-id';
process.env.NODE_ENV = 'test';

afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
});