'use client'
import './styles.css';
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '@/src/firebase'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GeistSans } from "geist/font/sans";
import { GeistMono } from 'geist/font/mono';

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#32cb8b',
    },
  },
  // typography: {
  //   fontFamily: [
  //     'Robert Sans',
  //   ]
  // }
});


export default function Home() {

  // manage our inventory list, modal state, and new item input respectively.
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  // fetch inventory data from Firestore
  const updateInventory = async () => {
    // query the inventory collection
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  useEffect(() => {
    updateInventory()
  }, [])

  
  // add an item to the inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  // delete an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ThemeProvider theme={theme}>
      <Box
        minHeight={'100vh'}
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        backgroundColor={'#191b25'}
        padding={8}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            width={400}
            backgroundColor={'#232533'}
            display={'flex'}
            flexDirection={'column'}
            padding={4}
            borderRadius={'10px'}
            gap={2}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              add item
            </Typography>
  
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="standard-basic"
                variant='standard'
                fullWidth
                color='secondary'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                InputProps={{
                  style: {
                    color: 'white'
                  }
                }}
              />
  
              <Button
                className='no-uppercase'
                variant='outlined'
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                add
              </Button>
            </Stack>
          </Box>
        </Modal>
  
        <Button 
          variant='contained' 
          onClick={handleOpen}
          color="secondary"
          className='no-uppercase'
        >
          add item
        </Button>

        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Box
            width={"40vw"}
            p={2}
            bgcolor={'#232533'}
            borderRadius={'10px'}
            display={'flex'}
          >
            <Typography variant={'h5'}>inventory</Typography>
          </Box>
          <Stack
            width={"40vw"}
            minHeight={"60vh"}
            bgcolor={'#232533'}
            borderRadius={'10px'}
            overflow={'auto'}
            padding={3}
            gap={2}

          >
            {
              inventory.map(({name, quantity}) => (
                <Box 
                  key={name}
                  width={'100%'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ borderBottom:"2px solid #191b25" }}>
                  <Typography variant={'h6'} width={'33%'}>{name}</Typography>
                  <Typography variant={'h6'} width={'33%'} display={'flex'} justifyContent={'center'}>{quantity}</Typography>
                  <Box width={'33%'} display={'flex'} justifyContent={'flex-end'}>
                    <IconButton color="primary" variant='contained' size='small' onClick={() => removeItem(name)} ><DeleteIcon /></IconButton>
                    <IconButton color="primary" variant='contained' size='small' onClick={() => addItem(name)} ><AddIcon /></IconButton>
                  </Box>
                </Box>
              ))
            }

          </Stack>
        </Box>
  
      </Box>
    </ThemeProvider>
  );
}
