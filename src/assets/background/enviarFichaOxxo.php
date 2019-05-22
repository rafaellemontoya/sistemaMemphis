<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $_POST= json_decode(file_get_contents('php://input'), true);



    $monto = $_POST['monto'];

    $nombreCliente = $_POST['nombreCliente'];

    $email = $_POST['email'];

    $referencia = $_POST['referencia'];


    set_time_limit(0);
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
        if(count($files) > 0){
            for($i=0;$i<count($files);$i++){
                if(is_file($files[$i])){
                    $message .= "--{$mime_boundary}\n";
                    $fp =    @fopen($files[$i],"rb");
                    $data =  @fread($fp,filesize($files[$i]));

                    @fclose($fp);
                    $data = chunk_split(base64_encode($data));
                    $message .= "Content-Type: application/octet-stream; name=\"".basename($files[$i])."\"\n" .
                    "Content-Description: ".basename($files[$i])."\n" .
                    "Content-Disposition: attachment;\n" . " filename=\"".basename($files[$i])."\"; size=".filesize($files[$i]).";\n" .
                    "Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
                }
            }
        }

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
        $subject = 'Tu ficha de pago en OXXO';
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
                      <a href="https://amexen.org/iec/2019/index">
                        <img src="https://www.memphis.com.mx/sistema/assets/background/enviar-correos/oxxopay_brand.png" alt="" width="150px"   />
                      </a>

                    </td>
                    <td  >
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="color: #3e455b; font-family: Arial, sans-serif; font-size: 16px;padding: 10px 0px 10px 0px;">
                              <B>MONTO A PAGAR</B>
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #000; font-family: Arial, sans-serif; font-size: 26px;padding: 10px 0px 10px 0px;">
                              <B>$ '.$monto.' MXN</B>
                            </td>

                          </tr>
                          <tr>
                            <td style="color: #3e455b;  font-family: Arial, sans-serif; font-size: 11px;">
                              OXXO cobrará una comisión adicional al momento de realizar el pago.
                            </td>

                          </tr>
                        </table>

                    </td>

                   </tr>

               <tr>

                <td colspan="2" style="padding: 20px 0 0px 0;color: #3e455b; font-family: Arial, sans-serif; font-size: 16px; ">
                  <B>REFERENCIA  DEL CLIENTE '.$nombreCliente.'</B>
                  <br>
                  <br>
                </td>
               </tr>

               <tr>
                <td align="center" colspan="2"bgcolor="#f8f9fa" style="padding: 15px 30px 15px 30px;border: 1px solid #c9c9cc;font-family: Arial, sans-serif; font-size: 26px; line-height: 20px; border-collapse: collapse;" >
                  <b>'.$referencia.'</b>

                </td>

               </tr>

                </table>

           </td>

         </tr>

         <tr>

                <td bgcolor="#f8f9fa" style="padding: 30px 30px 30px 30px;;border: 1px solid #c9c9cc;font-family: Arial, sans-serif;">

                  <table border="0" cellpadding="0" cellspacing="0" width="100%">

                  <tr>

                   <td width="75%" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 25px;">
                     <b>INSTRUCCIONES</b><br/>
                <ol>
                  <li >Acude a la tienda OXXO más cercana. <a href="https://www.google.com.mx/maps/search/oxxo/" target="_blank">Encuéntrala aquí</a>.</li>
        					<li>Indica en caja que quieres realizar un pago de <strong>OXXOPay</strong>.</li>
        					<li>Dicta al cajero el número de referencia en esta ficha para que tecleé directamete en la pantalla de venta.</li>
        					<li>Realiza el pago correspondiente con dinero en efectivo.</li>
        					<li>Al confirmar tu pago, el cajero te entregará un comprobante impreso. <strong>En el podrás verificar que se haya realizado correctamente.</strong> Conserva este comprobante de pago.</li>

        </ol>
                <!-- Tel. 5318-9056 ext. 101 -->
                   </td>



                  </tr>
                  <tr>

                   <td width="75%" background="#fff" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 25px;">

                     <table  bgcolor="#fff" style="padding: 15px 30px 15px 30px;border: 1px solid #00952f;font-family: Arial, sans-serif;" cellpadding="0" cellspacing="0" width="100%">

                     <tr>

                      <td align="center" bgcolor="#fff" width="75%" style="color:#00952f ;font-family: Arial, sans-serif; font-size: 14px; line-height: 25px;">
                        Al completar estos pasos recibirás un correo de <strong>Memphis</strong> confirmando tu pago.<br/>

                   <!-- Tel. 5318-9056 ext. 101 -->
                      </td>



                     </tr>

                    </table>
                <!-- Tel. 5318-9056 ext. 101 -->
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
            $respuesta = array(
              "status" => 1,
              "email" => $email
            );
          }else{
            $respuesta = array(
              "status" => -1,
              "email" => $email
            );
          }

          echo json_encode( $respuesta);



}













?>
