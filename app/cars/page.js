

"use client"
import { Toast } from "@/component/Toast";
import { env } from "@/next.config";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Rating, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
const img1 = "suv.png"
const img2 = "sedan.png"
const img3 = "jeep.png"

const imageList = [img1, img2, img3]
const tableHead = ['CarID', 'Name', 'Car Type', 'Rating', 'Fuel', 'Image', 'Hour Rate', 'Day Rate', 'Month Rate', 'Option']
// const textFieldData = ['name', 'carType', 'rating', 'fuel', 'image', 'hourRate', 'dayRate', 'monthRate']
const dataInput = [
  {
    name: 'name',
    type: 'text',
    grid: 12,
    label: 'Name',
  },
  {
    name: 'carType',
    type: 'text',
    grid: 6,
    label: 'Car Type',
  },
  {
    name: 'hourRate',
    type: 'text',
    grid: 6,
    label: 'Hour Rate',
  },
  {
    name: 'dayRate',
    type: 'text',
    grid: 6,
    label: 'Day Rate',
  },
  {
    name: 'monthRate',
    type: 'text',
    grid: 6,
    label: 'Month Rate',
  },
  {
    name: 'rating',
    type: 'rating',
    grid: 6,
    label: 'Rating',
  },
  {
    name: 'fuel',
    type: 'slider',
    grid: 6,
    label: 'Fuel',
  },
  {
    name: 'image',
    type: 'image',
    grid: 12,
    label: 'Image',
  },
]

const dummy = [
  { ID: "1", Name: "Agya", CarType: "SUV", Rating: "5", Fuel: "30", Image: "suv.png", HourRate: "24", DayRate: "2", MonthRate: "1" }
]




export default function Page() {

  const [data, setData] = useState([])
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [payload, setPayload] = useState({})
  const [crud, setCrud] = useState('')
  const router = useRouter();


  useEffect(() => {
    fetchData()
  }, [data])

  const fetchData = () => {
    let url = `${env.API_HOST}/cars`

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
    setPayload({})
    setOpen(false);
  };

  const onChange = (e, key) => {
    setPayload({
      ...payload,
      [key]: key === 'image' ? e.src : key === 'slider' ? '' : e?.target?.value
    })
    console.log(payload)
  }

  const onSubmit = () => {
    console.log(`${crud}!`)
    console.log('payload', payload)
    console.log('payload', JSON.stringify(payload))
    let url = `${env.API_HOST}/cars/${crud}`;

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
    let url = `${env.API_HOST}/cars/delete/${id}`;

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
              <TableRow key={index} className="">
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.ID}</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.Name}</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.CarType}</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">
                  <Rating value={parseInt(item.Rating)} readOnly />
                </TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.Fuel}%</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">
                  <Avatar src={item.Image} />
                </TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.HourRate} H</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.DayRate} D</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">{item.MonthRate} M</TableCell>
                <TableCell className="text-gray-400 bg-white p-6 font-semibold">

                  <Button variant="contained" className="bg-yellow-400 m-1" onClick={() => {
                    handleClickOpen('edit')
                    setCrud('edit')
                    setPayload({
                      carId: item.ID,
                      name: item.Name,
                      carType: item.CarType,
                      fuel: parseInt(item.Fuel),
                      rating: parseInt(item.Rating),
                      image: item.Image,
                      hourRate: item.HourRate,
                      dayRate: item.DayRate,
                      monthRate: item.MonthRate
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
          <Grid container spacing={1}>
            {dataInput.map((item, index) => (
              <Grid
                key={index}
                md={item.grid}
                className="p-1"
              >
                {item.type === 'text' ?
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    placeholder={item.label}
                    label={payload[item.name] && item.label}
                    value={payload[item.name]}
                    onChange={(e) => onChange(e, item.name)}
                    type={item.type}
                    fullWidth
                    variant="outlined"
                  />
                  : item.type === 'rating' ?
                    <Box className="p-1 border">
                      <Typography className="mb-1 font-semibold text-gray-500">{item.label}</Typography>
                      <Rating
                        name="simple-controlled"
                        value={payload[item.name]}
                        onChange={(e) => onChange(e, item.name)}
                      />
                    </Box>
                    : item.type === 'slider' ?
                      <Box className="p-1 border">
                        <Typography className=" font-semibold text-gray-500">{item.label} %</Typography>
                        <Slider
                          aria-label="Temperature"
                          defaultValue={payload[item.name] || 0}
                          valueLabelDisplay="auto"
                          step={10}
                          marks
                          min={0}
                          max={100}
                          onChange={(e) => onChange(e, item.name)}
                        />
                      </Box>
                      : item.type === 'image' ?
                        <Box className="p-1 border">
                          <Typography className=" font-semibold text-gray-500">{item.label}</Typography>
                          <ImagePicker
                            images={imageList.map((image, i) => ({ src: image, value: i }))}
                            onPick={(e) => onChange(e, item.name)}
                          />
                        </Box> : null}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}></Button> */}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>{crud.toUpperCase()}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


// "use client"
// import { env } from "@/next.config";
// import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const tableHead = ['CarID', 'Name', 'Car Type', 'Rating', 'Fuel', 'Image', 'Hour Rate', 'Day Rate', 'Month Rate', 'Option']
// const textFieldData = ['name', 'carType', 'rating', 'fuel', 'image', 'hourRate', 'dayRate', 'monthRate']

// export default function Page() {

//   const [data, setData] = useState([])
//   const [open, setOpen] = useState(false);
//   const [dialogTitle, setDialogTitle] = useState('');
//   const [payload, setPayload] = useState({})
//   const [crud, setCrud] = useState('')


//   useEffect(() => {
//     fetchData()
//   }, [data])

//   const fetchData = () => {
//     let url = `${env.API_HOST}/cars`

//     axios.get(url)
//       .then(res => {
//         setData(res.data)
//       })
//       .catch(err => {
//         console.log('error', err.message)
//         Toast.fire({
//           icon: 'error',
//           title: 'internal error'
//         })
//       })
//   }

//   const handleClickOpen = (title) => {
//     setDialogTitle(title)
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const onChange = (e, key) => {
//     setPayload({
//       ...payload,
//       [key]: e?.target?.value
//     })
//     console.log(payload)
//   }

//   const onSubmit = () => {
//     console.log('submit!')
//     console.log('payload', payload)
//     let url = `${env.API_HOST}/cars/${crud}`;

//     axios({
//       method: 'POST',
//       url: url,
//       headers: { "Content-Type": "application/json" },
//       data: JSON.stringify(payload)
//     })
//       .then(res => {
//         console.log('res', res.data)

//         Toast.fire({
//           icon: 'success',
//           title: `akun berhasil di buat`
//         })
//         router.replace('/')
//       })
//       .catch(err => {
//         console.log('error', err.message)
//         Toast.fire({
//           icon: 'error',
//           title: 'internal error'
//         })
//       }).finally(() => {
//         fetchData()
//       })
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-between p-24">
//       <TableContainer className="bg-blue-400">
//         <Button className="w-full" variant="contained" onClick={() => {
//           handleClickOpen('Add')
//           setPayload({})
//           setCrud('add')
//         }}>
//           Add
//         </Button>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {tableHead.map((item, index) => (
//                 <TableCell key={index}>
//                   <b className="text-white">{item}</b>
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell>{item.ID}</TableCell>
//                 <TableCell>{item.Name}</TableCell>
//                 <TableCell>{item.CarType}</TableCell>
//                 <TableCell>{item.Rating}</TableCell>
//                 <TableCell>{item.Fuel}</TableCell>
//                 <TableCell>{item.Image}</TableCell>
//                 <TableCell>{item.HourRate}</TableCell>
//                 <TableCell>{item.DayRate}</TableCell>
//                 <TableCell>{item.MonthRate}</TableCell>
//                 <TableCell>
//                   <Button variant="contained">
//                     Add
//                   </Button>
//                   <Button variant="contained" onClick={() => {
//                     handleClickOpen('edit')
//                     setCrud('edit')
//                     setPayload({
//                       carId: item.ID,
//                       pickUpLoc: item.PickUpLoc,
//                       dropOffLoc: item.DropOffLoc,
//                       pickUpDate: item.PickUpDate,
//                       dropOffDate: item.DropOffDate,
//                       carId: item.CarId,
//                       userId: item.UserId,
//                       adminId: item.AdminId
//                     })
//                   }}>
//                     Edit
//                   </Button>
//                   <Button variant="contained" onClick={() => {

//                   }}>
//                     Del
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//         <DialogTitle>{dialogTitle}</DialogTitle>
//         <DialogContent>
//           {textFieldData.map((item, index) => (
//             <TextField
//               autoFocus
//               margin="dense"
//               id="name"
//               label={item}
//               value={payload[item]}
//               onChange={(e) => onChange(e, item)}
//               type="text"
//               fullWidth
//               variant="standard"
//             />
//           ))}

//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={onSubmit}>{crud.toUpperCase()}</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
