import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../constants'
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Typography,
  Divider
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const BranchProfile = props => {
  const { className, branchId, ...rest } = props;

  const classes = useStyles();
  const [ branchProfile, setBranchProfile ] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));

  const user = {
    name: 'Test Test',
    city: 'DKI Jakarta',
    country: 'Indonesia',
    timezone: 'GMT+7',
    avatar: '/images/avatars/Picture1.png'
  };

  useEffect(() => {
    console.log(branchId)
    axios.get(API_BASE_URL + `/mainbranch-service/v1/branch/branchProfile/${branchId}`, {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setBranchProfile(res.data);
        })
        .catch(err => {
            console.log(err + localData.accessToken)
        })
  }, [branchProfile.branchAccountId])
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {branchProfile.branchName}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {branchProfile.cityName}, {branchProfile.address}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment().format('hh:mm A')} ({user.timezone})
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              Balance: Rp. 30.000.000 / 120.000.000
            </Typography>
            <div className={classes.progress}>
              <Typography variant="body1">Budget Limit: 25%</Typography>
              <LinearProgress
                value={25}
                variant="determinate"
              />
            </div>
          </div>
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

BranchProfile.propTypes = {
  className: PropTypes.string
};

export default BranchProfile;
