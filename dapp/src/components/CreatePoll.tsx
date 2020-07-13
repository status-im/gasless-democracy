import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'
import { Formik, FormikProps } from 'formik'
import Typography from '@material-ui/core/Typography'
import useStyles from '../styles/createPoll'
import StatusTextField from './base/TextField'
import DatePicker from './base/DatePicker'
import StatusButton from './base/Button'

type FormikValues = {
  title: string,
  subtitle: string,
  pollOptions: string,
  datePicker: Date | null,
  description: string
}

const TEN_DAYS_FUTURE = new Date(new Date().getTime()+(10*24*60*60*1000))
function CreatePoll() {
  const [showPreview, setPreview] = useState<boolean>(false)
  const classes: any = useStyles()
  const { fieldWidth } = classes

  return (
    <Formik
      initialValues={{
        title: '',
        subtitle: '',
        pollOptions: '',
        datePicker: TEN_DAYS_FUTURE,
        description: ''
      }}
      onSubmit={(values) => console.log({values})}
    >
      {({
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue
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
            <StatusTextField
              className={fieldWidth}
              idFor="Short Description"
              name="subtitle"
              label="Short Description"
              bottomRightLabel="Max 120"
              errorBorder={!!errors.subtitle}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.subtitle || ''}
              multiline={true}
            />
            <StatusTextField
              className={fieldWidth}
              name="pollOptions"
              label="Poll Options"
              placeholder="Add possible poll options (comma seperated)"
              idFor="Poll Options"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.pollOptions || ''}
            />
            <DatePicker
              className={classnames(fieldWidth, classes.datePicker)}
              name="datePicker"
              setFieldValue={setFieldValue}
              value={values.datePicker}
            />
            {showPreview &&
             <div className={classnames(classes.markdown, fieldWidth)}>
               <div
                 className={classnames(classes.adornmentText)}
                 onClick={() => {
                   setPreview(false)
                 }}
               >
                 Hide preview
               </div>
               <div>
                 <ReactMarkdown source={values.description} />
               </div>
             </div>}
            {(!showPreview) &&
             <StatusTextField
               className={fieldWidth}
               InputProps={{
                 style: { height: '10em' }
               }}
               idFor="Full description"
               name="description"
               label="Full description"
               bottomLeftLabel="Markdown available"
               onChange={handleChange}
               onBlur={handleBlur}
               value={values.description || ''}
               multiline={true}
               topRight={
                 <span
                   className={classnames(classes.adornmentText, classes.preview)}
                   onClick={() => {
                     setPreview(true)
                   }}
                 >
                   Preview
                 </span>
               }
             />}
            <StatusButton
              className={fieldWidth}
              buttonText="Submit"
              onClick={handleSubmit}
            />
          </form>
      )}
      }
      </Formik>
  )
}

export default CreatePoll
