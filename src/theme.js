import { createMuiTheme } from '@material-ui/core/styles';
 const theme = createMuiTheme({
    palette: {
       primary : {
           main : '#0288d1',
           light : '#039be5'
       },
       tertiary : {
           main : 'grey'
       },
       common : {
           blackish : '#424242',
           whitish : '#f9f9f9',
           lightWhite : '#c2b6b626'
       }
      }
});


export default theme;