import {Role} from '../models/User'

export const EXTERNAL_ROUTE_EPFL = 'https://www.epfl.ch/'
export const EXTERNAL_ROUTE_IMAGING = 'https://www.epfl.ch/research/domains/imaging/'
export const EXTERNAL_ROUTE_SDSC = 'https://datascience.ch/'
export const EXTERNAL_ROUTE_ONTOLOGY = 'https://imaging-plaza.epfl.ch/ontology'

export const ROUTES_HOME = '/'
export const ROUTES_ABOUT = '/about'
export const ROUTES_FAQ = '/faq'
export const ROUTES_FAQ_FAIR = '/faq#what-does-fair-mean'
export const ROUTES_CONTACT = '/contact'
export const ROUTES_TERMS = '/terms'
export const ROUTES_PRIVACY = '/privacy'
export const ROUTES_ONTOLOGY = '/ontology'

export const ROUTES_ADD_SOFTWARE_START = '/software/add/start'
export const ROUTES_ADD_SOFTWARE_OVERVIEW = '/software/add/overview'

export const ROUTES_EDIT_SOFTWARE_FORM = (id: string) =>
  `/software/edit/form?id=${encodeURIComponent(id)}&step=general`
export const ROUTES_SOFTWARE_DETAILS = (id: string) => `/software/${encodeURIComponent(id)}`

export const ROUTES_LOGIN = '/account/login'
export const ROUTES_SIGNUP = '/account/create'
export const ROUTES_FORGOT_PW = '/account/forgot-pw'
export const ROUTES_ACCOUNT = '/account?step=bookmarks'
export const ROUTES_SETUP = '/account/setup'
export const ROUTES_MANAGER = '/manager'

export const ROUTES_SEARCH = (query?: [{name: string; value: string}]) =>
  `/search${
    query
      ? `?${query
          .map(item => `${encodeURIComponent(item.name)}=${encodeURIComponent(item.value)}`)
          .join('&')}`
      : ''
  }`

export const PROTECTED_ROUTE_MAPPING = {
  '/manager': [Role.ADMIN],
  '/account': [Role.ADMIN, Role.USER],
  '/software/add/start': [Role.ADMIN, Role.USER],
  '/software/add/overview': [Role.ADMIN, Role.USER],
  '/software/edit/form': [Role.ADMIN, Role.USER],
}
