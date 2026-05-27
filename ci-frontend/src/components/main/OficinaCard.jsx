import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import placeholderImg from '../../assets/placeholder.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../style.css';

export function OficinaCard(oficina) {
    return (
        <Card className='card'>
          <CardMedia className='card-media'
            component="img"
            height="140"
            image={placeholderImg}
            alt={`"${oficina.titulo}"'s oficina card`}
          />
        <CardContent className='card-content'>
            <Typography className='card-titulo' gutterBottom variant="h5" component="div" title={oficina.titulo}>
              {oficina.titulo}
            </Typography>
            <Typography className='card-descricao' variant="body2">
              {oficina.descricao}
            </Typography>
          </CardContent>
        <CardActions>
          <Button className='card-button' size="large" color="primary" href={"#"} target='_blank'>
            <span>Ver detalhes</span>  < ArrowForwardIcon sx={{paddingLeft: '0.5rem'}} />
          </Button>
        </CardActions>
      </Card>
  );
}