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
  divider: {
    gridColumn: '3 / 48',
    marginTop: '2rem'
  },
  link: {
    gridColumn: '1 / 49',
    padding: 0,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  progress: {
    display: 'grid',
    gridTemplateColumns: 'repeat(48, [col] 1fr)',
    gridColumn: '1 / 49',
    placeItems: 'center'
  },
  progressText: {
    gridColumn: '1 / 8',
    placeSelf: 'start'
  },
  progressBar: {
    gridColumn: '3 / 43'
  },
  resultText: {
    gridColumn: '1/ 49',
    placeSelf: 'center',
    fontSize: '1.5rem'
  }
}))

export default useStyles
