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
  cardText: {
    gridColumn: '1 / 49',
    lineHeight: '2rem',
    padding: '0.25rem 1rem',
    color: '#000000'
  },
  cellColor: {
    background: '#F5F7F8'
  },
  cardLightText: {
    color: '#545353'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    paddingTop: '1rem'
  },
  cardSubTitle: {
    lineHeight: '1.5rem'
  }
}))

export default useStyles
