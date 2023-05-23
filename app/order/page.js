

"use client"
import { env } from "@/next.config";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const tableHead = ['OrderID', 'Pickup Loc', 'Dropoff Loc', 'Pickup Date', 'Dropoff Date', 'Pickup Time', 'CarID', 'UserID', 'AdminID', 'Option']
const textFieldData = ['pickUpLoc', 'dropOffLoc', 'pickUpDate', 'dropOffDate', 'pickUpTime', 'carId', 'userId', 'adminId']

export default function Page() {

  const [data, setData] = useState([])
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [payload, setPayload] = useState({})
  const [crud, setCrud] = useState('')


  useEffect(() => {
    fetchData()
  }, [data])

  const fetchData = () => {
    let url = `${env.API_HOST}/orders`

    axios.get(url)
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.log('error', err.message)
        Toast.fire({
          icon: 'error',
          title: 'internal error'
        })
      })
  }

  const handleClickOpen = (title) => {
    setDialogTitle(title)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (e, key) => {
    setPayload({
      ...payload,
      [key]: e?.target?.value
    })
    console.log(payload)
  }

  const onSubmit = () => {
    console.log('submit!')
    console.log('payload', payload)
    let url = `${env.API_HOST}/orders/${crud}`;

    axios({
      method: 'POST',
      url: url,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload)
    })
      .then(res => {
        console.log('res', res.data)

        Toast.fire({
          icon: 'success',
          title: `akun berhasil di buat`
        })
        router.replace('/')
      })
      .catch(err => {
        console.log('error', err.message)
        Toast.fire({
          icon: 'error',
          title: 'internal error'
        })
      }).finally(() => {
        fetchData()
      })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <TableContainer className="bg-blue-400">
        <Button className="w-full" variant="contained" onClick={() => {
          handleClickOpen('Add')
          setPayload({})
          setCrud('add')
        }}>
          Add
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              {tableHead.map((item, index) => (
                <TableCell key={index}>
                  <b className="text-white">{item}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.ID}</TableCell>
                <TableCell>{item.PickUpLoc}</TableCell>
                <TableCell>{item.DropOffLoc}</TableCell>
                <TableCell>{item.PickUpDate}</TableCell>
                <TableCell>{item.DropOffDate}</TableCell>
                <TableCell>{item.PickUpTime}</TableCell>
                <TableCell>{item.CarId}</TableCell>
                <TableCell>{item.UserId}</TableCell>
                <TableCell>{item.AdminId}</TableCell>
                <TableCell>
                  <Button variant="contained">
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => {
                    handleClickOpen('edit')
                    setCrud('edit')
                    setPayload({
                      orderId: item.ID,
                      pickUpLoc: item.PickUpLoc,
                      dropOffLoc: item.DropOffLoc,
                      pickUpDate: item.PickUpDate,
                      dropOffDate: item.DropOffDate,
                      carId: item.CarId,
                      userId: item.UserId,
                      adminId: item.AdminId
                    })
                  }}>
                    Edit
                  </Button>
                  <Button variant="contained" onClick={() => {

                  }}>
                    Del
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {textFieldData.map((item, index) => (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={item}
              value={payload[item]}
              onChange={(e) => onChange(e, item)}
              type="text"
              fullWidth
              variant="standard"
            />
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>{crud.toUpperCase()}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
