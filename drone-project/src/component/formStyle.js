let isMobile = false;

{
  const mediaQuery = window.matchMedia('(max-width: 900px)');
    isMobile = mediaQuery.matches;
    
    const handleResize = (event) => {
      isMobile = event.matches;
    };

    mediaQuery.addEventListener( 'change', handleResize);

    window.addEventListener('resize', () => {
      isMobile = mediaQuery.matches;
    });
}

const divStyle = {
  width: isMobile? '80vw' : '50vw',
  height:'',
  marginLeft : isMobile? '10vw' : '25vw',
  marginRight: isMobile? '10vw' : '25vw',
  marginTop : '' ,
  backgroundColor:'rgba(158, 158, 158 , 0.4)',
  border: '1px solid gray',
  paddingRight: '5%',
  paddingLeft: '5%',
  paddingBottom: '2rem',
  paddingTop:'2%'
}

const labelStyle = {
    marginBottom: '0.2rem',
    marginRight: '0.5rem',
    marginTop: "1rem",
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
  };
  
  const sapnErrorStyle = {
    marginBottom: '0.5rem',
    marginRight: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'rgb(220 38 38)',
  }
    
  const inputStyle = {
    width:'100%',
    fontSize: '0.875rem',
    color: '#1f2937',
    border: '1px solid #d1d5db',
    borderRadius: '0.4rem',
    cursor: 'pointer',
    backgroundColor: '#f9fafb',
    outline: 'none',
    placeholderColor: '#9ca3af',
    height: '2.2rem'
  };
    
  const helpTextStyle = {
    marginTop: '0.1rem',
    marginRight: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
  }
  
  const loadingOverlay = {
      minHeight:'100vh',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      Zindex: '999',
      PointerEvent: 'none'
  }
  
  const loadingText = {
      marginTop: '2rem',
      marginBottom : '1rem' ,
      fontSize: '1rem',
      color: '#1f2937',
  }
  
  const textError = {
    color: 'black',
    marginBottom: '1rem',
    fontWeight : '500',
    fontSize: '1.3rem'
  }
  
  const modal = {
      width: '70%',
      border: '1px solid #d1d5db',
      borderRadius: '0.4rem',
      backgroundColor: '#f9fafb',
      textAlign : 'center',
      paddingTop : '1.5rem',
      paddingBottom : '1rem',
      paddingRight : '2rem',
      paddingLeft : '2rem'
  }
  
  export{divStyle,helpTextStyle,inputStyle,labelStyle,sapnErrorStyle,loadingOverlay,loadingText,modal,textError,isMobile}
  