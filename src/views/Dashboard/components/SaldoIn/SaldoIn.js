import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar
} from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/Money';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: '#28B8D7',
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
    color: 'white'
  },
  avatar: {
    backgroundColor: '#1B78D7',
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));

const SaldoIn = props => {
  const { className, ...rest } = props;

  const [ mainProfile, setMainProfile ] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const classes = useStyles();

  var money = `${mainProfile.bufferBalance}`;
  var moneyDots = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/main/mainProfile', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setMainProfile(res.data);
        })
        .catch(err => {
            console.log(err)
        })
  }, [mainProfile.id])
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
      <br />
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="h4"
            >
              Useable Balance
            </Typography>
            <Typography color="inherit" variant="h4">Rp. {moneyDots}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <br />
      </CardContent>
    </Card>
  );
};

SaldoIn.propTypes = {
  className: PropTypes.string
};

export default SaldoIn;
