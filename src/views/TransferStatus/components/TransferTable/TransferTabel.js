import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TableSortLabel,
  TablePagination
} from '@material-ui/core';
import { StatusBullet } from 'components';

import mockData from './data';
import TransferDetail from './components/TransferDetail'

const useStyles = makeStyles(theme => ({
  root: {},
  deactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red'
  },
  approveButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'primary'
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  dialogtitle:{
    backgroundColor: '#00A479'
  },
  agreement: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  agreementCheckbox: {
    marginLeft: '-14px'
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 500
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
}));

const statusColors = {
  Success: 'success',
  Pending: 'info',
  Failed: 'danger'
};

const UsersTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();
  
  const [mainTrxLists, setMainTrxLists] = useState([]);
  const [transcationProfile, setTranscationProfile] = useState({});
  const [trxId, setTrxId] = useState();
  const [branchId, setBranchId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow, setOpenRow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    axios.get(API_BASE_URL + '/trx-service/v1/transactionMain/listAllMainTrx', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setMainTrxLists(res.data);
        })
        .catch(err => {
            console.log(err + localData.accessToken)
        })
  }, [])

  const handleRowClick = (mainAcctTrxId) => {
    axios.get(API_BASE_URL + `/trx-service/v1/transactionMain/searchMainTrx/${mainAcctTrxId}` , {
      headers: {
        'Authorization': `Bearer ${localData.accessToken}` 
      }
    })
      .then(res => {
          console.log(res) 
          setTranscationProfile(res.data);
      })
      .catch(err => {
          console.log(err + localData.accessToken)
      })
    setOpenRow(true);
  };

  const handleRowClose = () =>{
    setOpenRow(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
    setOpenRow(false);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card
    {...rest}
    className={clsx(classes.root, className)}
    >
      {/* <CardHeader
        title="Transfer Status List"/>
      <Divider /> */}
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.content}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ref Number</TableCell>
                  {/* <TableCell>Origin</TableCell> */}
                  <TableCell>Destination</TableCell>
                  <TableCell>Transfer Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Transfer Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {mainTrxLists.slice(0, rowsPerPage).map(mainTrxList => (
                  <TableRow
                    hover
                    key={mainTrxList.mainAcctTrxId}
                    onClick={()=>handleRowClick(mainTrxList.mainAcctTrxId)}
                  >
                    <TableCell>007/1/{mainTrxList.mainAcctTrxId}</TableCell>
                    {/* <TableCell>Chandra Wijaya</TableCell> */}
                    <TableCell>{mainTrxList.transferToAcct}</TableCell>
                    <TableCell>{mainTrxList.transferType}</TableCell>
                    <TableCell>{mainTrxList.trxAmount}</TableCell>
                    <TableCell>
                      {moment(mainTrxList.trxDate).format('DD/MM/YYY')}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[mainTrxList.status]}
                          size="sm"
                        />
                        {mainTrxList.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={mainTrxLists.length}
          onChangePage={handlePageChange}
          onChangeRowPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
      <Divider />

      <Dialog onClose={handleRowClose} aria-labelledby="costumized-dialog-title" open={openRow} maxWitdh='lg' fullWidth>
        <DialogTitle
          className ={classes.dialogtitle}
          id="costumized-dialog-title"
          onClose={handleRowClose}
        >
          <span style={{color: 'white'}}>Transfer Detail</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              {/* <div className={classes.inner}>
                <TransferDetail branchId={branchId} />
              </div> */}
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfer ID"
                name="transferId"
                type="text"
                variant="outlined"
                value={transcationProfile.mainToBranchTrxId || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfered By"
                name="transferBy"
                type="text"
                variant="outlined"
                value={transcationProfile.trxByUser || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="transfer Origin"
                name="nameOrigin"
                type="text"
                variant="outlined"
                value={transcationProfile.mainAccountName || ''} 
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfer Destination Name"
                name="destinationName"
                type="text"
                variant="outlined"
                value={transcationProfile.branchAccountName || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="transfer Destination Number"
                name="destinationNo"
                type="text"
                variant="outlined"
                value={transcationProfile.transferToAcct || ''} 
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Amount"
                name="amount"
                type="text"
                variant="outlined"
                value={transcationProfile.trxAmount || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="TransferType"
                name="type"
                type="text"
                variant="outlined"
                value={transcationProfile.transferType || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Date"
                name="date"
                type="text"
                variant="outlined"
                value={transcationProfile.trxDate || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Remark"
                name="remark"
                type="text"
                variant="outlined"
                value={transcationProfile.remarks || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Status"
                name="status"
                type="text"
                variant="outlined"
                value={transcationProfile.status || ''}
              />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button 
            className={classes.approveButton}
            autoFocus onClick={handleRowClose} color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )

};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
