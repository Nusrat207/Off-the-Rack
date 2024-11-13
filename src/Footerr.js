import React from 'react'
import Logo from './img/iut.png';

import { Link, useNavigate } from 'react-router-dom'
export default function Footerr() {
  return (
    <div>
    <div className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
<div className="col-md-4 d-flex align-items-center">

  <Link to="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
  </Link>
  <span className="mb-3 mb-md-0 text-muted"> 2024 Team TeaStall, CSE 4508
  <img src={Logo} alt="iut logo" style={{ width: '15px', marginRight:'0px', marginLeft:'5px' }} /> 
  </span>
</div>

</div>
</div>
  )
}
