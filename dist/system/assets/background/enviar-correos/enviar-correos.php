<?php
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
$s="localhost";
$u="amexenor_cliente";
$p="AmexEn100114";
$db="amexenor_registro";
$conexion = new mysqli($s, $u, $p,$db );
if ($resultado = $conexion->query("SELECT id, email FROM registro WHERE id > 1 ")) {
    printf("La selección devolvió %d filas.\n", $resultado->num_rows);
    $from = 'amexen@amexen.com';
    $from_name = 'Academia Mexicana de Energía';

    //attachment files path array
    $files = array('CIE.pdf','IEC.pdf');
    $subject = 'Aceptación de trabajos';
    $html_content = '
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">

     <head>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <title>Demystifying Email Design</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    </head>

    <body style="margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
      		<tr>
      			<td style="padding: 10px 0 30px 0;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #ccc; border-collapse: collapse;">

     <tr>

       <td align="center" bgcolor="#fff" style="padding: 0px 0 0px 0;">
         <a href="https://amexen.org/iec/2019/index">
        <img src="https://amexen.org/iec/2019/enviar-correos/header2.png" alt="" width="500"  style="display: block;" />
      </a>
       </td>

     </tr>

     <tr>

       <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">

        <table border="0" cellpadding="0" cellspacing="0" width="100%">

       <tr>

        <td style="color: #4f9cdb; font-family: Arial, sans-serif; font-size: 24px;">

         <b>Próximamente se enviarán las cartas de aceptación de los trabajos.</b>

        </td>

       </tr>

       <tr>

        <td style="padding: 20px 0 30px 0;color: #414141; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">

      Les solicitamos que vayan tengan listos los trabajos en extenso para las Memorias del Congreso.
        <br>
        <br>
        <font color= "#4CAF50"> Les recordamos que es necesario descargar el formato del sitio web del Congreso.</font>
        <br><br>

        </td>

       </tr>

       <tr>

        <td>

          <a href="https://amexen.org/iec/2019/plantilla-extensoCIE19">
            <img src="https://amexen.org/iec/2019/enviar-correos/btn-formato.png" width="150px" alt="" />
         </a>

        </td>

       </tr>

        </table>

       </td>

     </tr>

     <tr>

    <td bgcolor="#feb505" style="padding: 30px 30px 30px 30px;">

      <table border="0" cellpadding="0" cellspacing="0" width="100%">

      <tr>

       <td width="75%" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 18px;">
         <b>Dra. Margarita M. González Brambila</b><br/>
    Presidenta de la Academia Mexicana de Energía, A. C.<br/>

    Universidad Autónoma Metropolitana - Azcapotzalco<br/>
    Coordinadora General de CIE 2019<br/>

    <!-- Tel. 5318-9056 ext. 101 -->
    Cel. 044-55-26531825
       </td>


         <td align="right">

            <table border="0" cellpadding="0" cellspacing="0">

           <tr>


            <td style="font-size: 0; line-height: 0;" width="20">&nbsp;>


             <a href="https://amexen.org">

              <img src="https://amexen.org/iec/2019/enviar-correos/logo-amexen.png" alt="" width="100"  style="display: block;" border="0" />

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
    </td>
    </tr>
    </table>
    </body>

    </html>


    ';


    while($row=mysqli_fetch_array($resultado)){
      // echo $row;
      $email=$row['email'];
      $id=$row['id'];

      //email variables
      $to = $email;
      //call multi_attach_mail() function and pass the required arguments
      $send_email = multi_attach_mail($to,$subject,$html_content,$from,$from_name,$files);

      echo"<br>$id $email :";
      //print message after email sent
      echo $send_email?"<h1>Mail Sent</h1>":"<h1>Mail sending failed.</h1>";

    }
    /* liberar el conjunto de resultados */
    $resultado->close();
}


?>
