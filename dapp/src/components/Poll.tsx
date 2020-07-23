import React, { Fragment, useContext } from 'react'
import useStyles from '../styles/poll'
import { useParams } from "react-router-dom"
import { MessagesContext } from '../context/messages/context'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { Formik, FormikProps } from 'formik'

type IBallot = {
  option: string
}

function Poll() {
  const { id } = useParams()
  const classes: any = useStyles()
  const messagesContext = useContext(MessagesContext)
  const { chatMessages } = messagesContext
  console.log({chatMessages})
  if (!chatMessages) return <Fragment />
  const selectedPoll= chatMessages['polls'].find(p => p.messageId === id)
  if (!selectedPoll || !selectedPoll.pollInfo) return <Fragment />
  const { pollInfo } = selectedPoll
  const { description, title, subtitle, pollOptions } = pollInfo
  const options = pollOptions.split(',')
  // TODO Display ^above data
  // TODO Add method to vote
  //TODO vote options are drop down menu
  // TODO Add method to tabulate votes
  console.log({selectedPoll, options})

  return (
    <Formik
      initialValues={{
        option: ''
      }}
      onSubmit={(values) => {
        console.log({values})
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit
      }: FormikProps<IBallot>) => {
        return (
          <form className={classes.root} onSubmit={handleSubmit}>
            <Typography className={classes.title}>{title}</Typography>
            <Typography className={classes.subtitle}>{subtitle}</Typography>
            <Typography className={classes.description}>{description}</Typography>
            <TextField
              id="option"
              name="option"
              className={classes.dropDown}
              select
              label="Select"
              value={values.option}
              onChange={handleChange}
              helperText="Select an option"
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </form>
      )}
      }
    </Formik>
  )
}

export default Poll
