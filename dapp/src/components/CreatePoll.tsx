import React from 'react'
import { Formik, FormikProps } from 'formik'
import Typography from '@material-ui/core/Typography'
import useStyles from '../styles/createPoll'
import StatusTextField from './base/TextField'

type FormikValues = {
  title: string
}

function CreatePoll() {
  const classes: any = useStyles()
  const { fieldWidth } = classes

  return (
    <Formik
      initialValues={{
        title: ''
      }}
      onSubmit={(values) => console.log({values})}
    >
    {({
      values,
      handleSubmit,
      handleChange,
      handleBlur
    }: FormikProps<FormikValues>) => {
    return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Typography className={classes.title} variant="h3">Create a poll</Typography>
      <StatusTextField
        className={fieldWidth}
        name="title"
        label="This will be the poll title"
        idFor="Title"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.title || ''}
      />
    </form>
    )}
    }
    </Formik>
  )
}

export default CreatePoll
