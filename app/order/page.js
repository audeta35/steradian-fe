

"use client"
import { Toast } from "@/component/Toast";
import { env } from "@/next.config";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const tableHead = ['OrderID', 'Pickup Loc', 'Dropoff Loc', 'Pickup Date', 'Dropoff Date', 'Pickup Time', 'CarID', 'UserID', 'AdminID', 'Option']
const dataInput = [
  {
    name: 'pickUpLoc',
    type: 'text',
    grid: 6,
    label: 'Pick Up Location',
  },
  {
    name: 'dropOffLoc',
    type: 'text',
    grid: 6,
    label: 'Drop Off Location',
  },
  {
    name: 'pickUpDate',
    type: 'date',
    grid: 6,
    label: 'Pick Up Date',
  },
  {
    name: 'dropOffDate',
    type: 'date',
    grid: 6,
    label: 'Drop Off Date',
  },
  {
    name: 'pickUpTime',
    type: 'text',
    grid: 6,
    label: 'Pick Up Time',
  },
  {
    name: 'carId',
    type: 'text',
    grid: 6,
    label: 'Card ID',
  },
  {
    name: 'userId',
    type: 'text',
    grid: 6,
    label: 'User ID',
  },
  {
    name: 'adminId',
    type: 'text',
    grid: 6,
    label: 'Admin ID',
  }
]

const dummy = [
  { ID: "2", PickUpLoc: "Tanggerang", DropOffLoc: "BSD", PickupDate: "04/02/2002", DropOffDate: "2002-20-04", PickUpTime: "19:00", CardId: "1", UserId: "1", AdminId: "1" }
]


export default function Page() {

  const [data, setData] = useState([])
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [payload, setPayload] = useState({})
  const [crud, setCrud] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('auth')) {
      router.push('/')
      Toast.fire({
        icon: 'info',
        title: 'Login terlebih dahulu'
      })
    }
    fetchData()
    setIsLoading(false)
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
    console.log(`${crud}!`)
    console.log('payload', payload)
    console.log('payload', JSON.stringify(payload))
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
          title: `${crud} success`
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

  const deleteData = (id) => {
    console.log('delete!')
    console.log('payload', payload)
    console.log('payload', JSON.stringify(payload))
    let url = `${env.API_HOST}/orders/delete/${id}`;

    axios.delete(url)
      .then(res => {
        console.log(res)
        fetchData()
      })
      .catch(err => {
        console.log('error', err.message)
        fetchData()
      })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading &&
        <LinearProgress />
      }
      <TableContainer className="bg-blue-400">
        <Button className="bg-blue-900 m-2" variant="contained" onClick={() => {
          router.replace('/')
        }}>
          back
        </Button>
        <Button className="float-right bg-blue-900 m-2" variant="contained" onClick={() => {
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
            {dummy.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.ID}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.PickUpLoc}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.DropOffLoc}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.PickUpDate}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.DropOffDate}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.PickUpTime}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.CarId}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.UserId}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">{item.AdminId}</TableCell>
                <TableCell className="text-gray-400 bg-white font-semibold">
                  <Button variant="contained" className="bg-yellow-400 m-1" onClick={() => {
                    handleClickOpen('edit')
                    setCrud(`edit/${item.ID}`)
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
                  <Button variant="contained" className="bg-red-400 m-1" onClick={() => {
                    deleteData(item.ID)
                  }}>
                    Del
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={0}>
            {dataInput.map((item, index) => (
              <Grid md={item.grid} className="p-1">
                <TextField
                  autoFocus
                  key={index}
                  margin="dense"
                  id="name"
                  placeholder={item.label}
                  label={payload[item.name] && item.label}
                  value={item.type === 'date' ? Date(payload[item.name]) : payload[item.name]}
                  onChange={(e) => onChange(e, item.name)}
                  type={item.type}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>{crud.toUpperCase()}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
