import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios'; 
import { API_BASE_URL } from '../../../../constants';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar
} from '@material-ui/core';
import MoneyBurn from '@material-ui/icons/Eject';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: '#FD7B6F',
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
    backgroundColor: 'red',
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

const SaldoOut = props => {
  const { className, ...rest } = props;

  const [ mainProfile, setMainProfile ] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const classes = useStyles();

  var money = `${mainProfile.mainBalance}`;
  var moneyDots = (money/10).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."); // hardcoded for demo
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
              color="textSecondary"
              gutterBottom
              variant="h4"
            >
              Balance OUT
            </Typography>
            <Typography color="inherit" variant="h4">Rp. {moneyDots}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyBurn className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <br />
      </CardContent>
    </Card>
  );
};

SaldoOut.propTypes = {
  className: PropTypes.string
};

export default SaldoOut;
