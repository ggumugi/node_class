import { Container } from '@mui/material'
import ItemSellDetail from '../components/item/itemSellDetail'

function ItemSellDetailPage() {
   return (
      <Container
         maxWidth="lg"
         sx={{
            marginTop: 10, // 1 = 8px, 혹은 mt: 10
            marginBottom: 13,
         }}
      >
         <ItemSellDetail />
      </Container>
   )
}

export default ItemSellDetailPage
