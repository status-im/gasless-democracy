import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(48, [col] 1fr)',
    gridColumn: '3 / 45',
    [theme.breakpoints.up('md')]: {
      gridTemplateRows: '4rem 4rem auto auto 6rem',
      gridColumn: '8 / 42',
    }
  },
  title: {
    gridColumn: '3 / 45',
    fontSize: '3rem'
  },
  subtitle: {
    gridColumn: '2 / 45',
    fontSize: '2rem'
  },
  description: {
    gridColumn: '3 / 45',
    fontSize: '1rem'
  },
  dropDown: {
    gridColumn: '3 / 45'
  },
  link: {
    gridColumn: '1 / 49',
    padding: 0,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

export default useStyles
