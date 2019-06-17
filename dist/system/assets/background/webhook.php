<?
$body = @file_get_contents('php://input');
$data = json_decode($body);
http_response_code(200); // Return 200 OK

if ($data->type == 'charge.paid'){


  //Titulo
  $titulo = "Pago exitoso";
  //cabecera
  // $headers = "MIME-Version: 1.0\r\n";
  // $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
  //dirección del remitente

  // $email = $data->object->details->email;
  $email = "rafaellemontoya9@gmail.com";
  $nombreCliente =  $data->data->object->order_id;
  // $nombreCliente =  $data->charges->data->object->details->name;
  $payment_method = $data->data->object->payment_method->type;
  // $idConekta = $data->order_id;
  // $numeroConfirmacion = $data->object->id;
  // $monto = $data->amount;
  // $nombreCliente = $data->details->name;
  // $idConekta = $data->order_id;
  // $numeroConfirmacion = '$data->object->id';
  // $monto = $data->object;
  //Enviamos el mensaje a tu_dirección_email

  function multi_attach_mail($to, $subject, $message, $senderMail, $senderName, $files){

      $from = $senderName." <".$senderMail.">";
      $headers = "From: $from";

      // boundary
      $semi_rand = md5(time());
      $mime_boundary = "==Multipart_Boundary_x{$semi_rand}x";

      // headers for attachment
      $headers .= "\nMIME-Version: 1.0\n" . "Content-Type: multipart/mixed;\n" . " boundary=\"{$mime_boundary}\"";

      // multipart boundary
      $message = "--{$mime_boundary}\n" . "Content-Type: text/html; charset=\"UTF-8\"\n" .
      "Content-Transfer-Encoding: 7bit\n\n" . $message . "\n\n";

      // preparing attachments

      $message .= "--{$mime_boundary}--";
      $returnpath = "-f" . $senderMail;

      //send email
      $mail = @mail($to, $subject, $message, $headers, $returnpath);

      //function return true, if email sent, otherwise return fasle
      if($mail){ return TRUE; } else { return FALSE; }

  }


  // include("conexion.php");

  // $conexion = new mysqli($s, $u, $p,$db );

      $from = 'memphis@memphis.com';
      $from_name = 'Memphis ';

      //attachment files path array
      $files = array();
      $subject = 'Tu pago en OXXO ha sido recibido';
      $html_content = '
      <!DOCTYPE html PUBLIC "">

      <html xmlns="http://www.w3.org/1999/xhtml">

       <head>

      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

      <title>Mailing</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      </head>

      <body style="margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
        		<tr>
        			<td style="padding: 10px 0 30px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #ccc; border-collapse: collapse;">

         <tr>

           <td align="center"  style="padding: 0px 0 0px 0;">
             <table align="center" border="0" cellpadding="0" cellspacing="0" width="538PX" style="border: 1px solid #ccc; border-collapse: collapse;">
               <tr>
                 <td align="center"style="color: #fff; font-family: Arial, sans-serif; font-size: 12px;padding: 5px 0 5px 0;"  bgcolor="#000">
                   FICHA DIGITAL, NO ES NECESARIO IMPRIMIR.
                   '.$payment_method.'
               </td>
             </tr>
             </table>
           </td>

         </tr>
         <tr>

           <td align="center"  style="padding: 10px 0 0px 0;">
             <table align="center" border="0" cellpadding="0" cellspacing="0" width="538PX" style=" border-collapse: collapse;">
               <tr>
                 <td align="center"style="color: #fff; font-family: Arial, sans-serif; font-size: 12px;padding: 5px 0 5px 0;"  >
                   <a href="https://www.memphis.com.mx/#/">
                     <img src="https://www.memphis.com.mx/assets/assets-slider/images/logo_light.png" alt=""    />
                   </a>
               </td>
             </tr>
             </table>
           </td>

         </tr>

       <tr>

         <td bgcolor="#ffffff" style="padding: 10px 30px 40px 30px;">

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                 <tr>

                  <td width="50%" style="color: #4f9cdb; font-family: Arial, sans-serif;">
                    <a href="https://www.memphis.com.mx/#/">
                      <img src="https://www.memphis.com.mx/sistema/assets/background/enviar-correos/oxxopay_brand.png" alt="" width="150px"   />
                    </a>

                  </td>
                  <td  >
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="color: #00952f; font-family: Arial, sans-serif; font-size: 16px;padding: 10px 0px 10px 0px;">
                            <B>MONTO PAGADO</B>
                          </td>
                        </tr>
                        <tr>
                          <td style="color: #00952f; font-family: Arial, sans-serif; font-size: 26px;padding: 10px 0px 10px 0px;">
                            <B>$ '.$monto.'</B>

                          </td>

                        </tr>
                        <tr>


                        </tr>
                      </table>

                  </td>

                 </tr>

             <tr>

              <td colspan="2" style="padding: 20px 0 0px 0;color: #3e455b; font-family: Arial, sans-serif; font-size: 16px; ">
                <B>Estimado: '.$nombreCliente.' </B>
                <br>
                <br>
              </td>
             </tr>

             <tr>
              <td align="center" colspan="2"bgcolor="#F3FFF4" style="padding: 15px 30px 15px 30px;border-top:  1px solid #00952f; border-left:  1px solid #00952f; border-right:  1px solid #00952f;font-family: Arial, sans-serif; font-size: 26px; line-height: 20px; border-collapse: collapse;" >
                <b style="color:#21B921">Tu pago ha sido recibido con éxito</b>


              </td>

             </tr>
             <tr>
              <td align="center" colspan="2"bgcolor="#F3FFF4" style="padding: 15px 30px 15px 30px;border-bottom:  1px solid #00952f; border-left:  1px solid #00952f; border-right:  1px solid #00952f;font-family: Arial, sans-serif; font-size: 20px; line-height: 20px; border-collapse: collapse;" >
                <p style="color:#21B921">Número de confirmación: '.$numeroConfirmacion.' </p>


              </td>

             </tr>

              </table>

         </td>

       </tr>

       <tr>

              <td style="padding: 0px 30px 0px 30px;font-family: Arial, sans-serif;">



              </td>

       </tr>
       <tr>

              <td bgcolor="#5c98fb" style="padding: 30px 30px 30px 30px;">

                <table border="0" cellpadding="0" cellspacing="0" width="100%">

                <tr>

                 <td width="75%" style="color:#fff;font-family: Arial, sans-serif; font-size: 20px; line-height: 25px;">
                   <b>¿Tienes dudas?</b><br/>
                   <a href="tel: 55182240">
              <font color="#fff">Llámanos al 55 18 22 40<br/>
            </a>
                 </td>


                   <td align="right">

                      <table border="0" cellpadding="0" cellspacing="0">

                     <tr>


                      <td style="font-size: 0; line-height: 0;" width="20">&nbsp;>
                        <a href="https://www.memphis.com.mx/#/">
                          <img src="https://www.memphis.com.mx/assets/assets-slider/images/logo_light.png" alt="" width="150px"   />
                        </a>
                      </td>

                     </tr>

                      </table>


                 </td>

                </tr>

               </table>

              </td>

       </tr>
       <tr>

              <td bgcolor="#fff" style="padding: 0px 30px 0px 30px;">

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                  <td align="center" width="75%" style="color:#5c98fb;font-family: Arial, sans-serif; font-size: 16px; line-height: 25px;">
                    <a href="https://www.estoy-en-linea.com/">
                      <font color="#5c98fb">
                    <b>Sitio desarrollado por</b><br/>
                 </a>
                  </td>
                </tr>
                <tr>



                   <td align="center">

                     <a href="https://www.estoy-en-linea.com/">
                       <img src="https://www.estoy-en-linea.com/assets/images/EstoyEnLinea_Logo.png" alt="" width="200px"   />
                     </a>


                 </td>

                </tr>

               </table>

              </td>

       </tr>

      </table>
      </td>
      </tr>
      </table>
      </body>

      </html>

      ';


        //email variables
        $to = $email;
        //call multi_attach_mail() function and pass the required arguments
        $send_email = multi_attach_mail($to,$subject,$html_content,$from,$from_name,$files);
        if ($send_email == TRUE){
          $send_email = multi_attach_mail("rmontoya@themyt.com","Envio correcto","ENvio correcto",$from,$from_name,$files);
        }else{
          $send_email = multi_attach_mail("rmontoya@themyt.com","Fallo de envio","Fallo de envio",$from,$from_name,$files);
        }

        // echo json_encode( $respuesta);


// }
  // if($bool==true){
  //   echo "enviado";
  // }else{
  //   echo "error al enviar";
  // }
?>
<!-- <span class="metadata" id="idConekta" title="<?php echo $titulo ?>"></span>

<script src="https://www.gstatic.com/firebasejs/6.0.4/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.0.4/firebase-database.js"></script>
<script src="ActualizarEstado.js"></script> -->

<?

}

?>
