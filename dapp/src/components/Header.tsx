import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'
import { EnableEthereum } from '../types'
import useStyles from '../styles/header'
import { setNetwork } from '../utils/network'

const formatAccount = (account: string): string => {
  const start = account.slice(0,6)
  const end = account.slice(-4)
  return `${start}...${end}`
}

type HeaderProps = {
  account: string,
  isStatus: boolean
  enableEthereum: EnableEthereum
}

function Header({account, isStatus, enableEthereum}: HeaderProps) {
  const classes: any = useStyles()
  const [network, sNetwork] = useState()

  useEffect(() => {
    if (account) setNetwork(sNetwork)
  }, [account])

  return (
    <div className={classes.root}>
      {network && <div className={classes.networkIndicator} />}
      {network && <Typography className={classes.network}>
        {network}
      </Typography>}
      <Typography component={'span'} className={classNames(classes.connect, {[classes.connected]: !!account})} onClick={!account ? enableEthereum : console.log}>
        {!!account && <div className={classes.connectedText}>
          <div className={classes.accountText}>{formatAccount(account)}</div>
          <div>Connected</div>
        </div>}
        {!account && <span>Connect</span>}
        {isStatus && <span>Status Api Available</span>}
      </Typography>
    </div>
  )
}

export default Header
