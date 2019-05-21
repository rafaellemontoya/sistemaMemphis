<?php
require_once("lib/Conekta.php");
\Conekta\Conekta::setApiKey("key_WY7i4c5CWnofjAyryEnr1Q");
\Conekta\Conekta::setApiVersion("2.0.0");


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $_POST= json_decode(file_get_contents('php://input'), true);

    $monto = $_POST['monto'];
    $concepto = $_POST['concepto'];
    $unidades = $_POST['unidades'];
    $nombreCliente = $_POST['nombreCliente'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $keyVenta = $_POST['keyVenta'];

    if (strlen($telefono)!= 10){
        $telefono = "5555555555";
    }

    try{
        $order = \Conekta\Order::create(
          array(
            "line_items" => array(
              array(
                "name" => $concepto,
                "unit_price" => $monto,
                "quantity" => 1
              )//first line_item
            ), //line_items
            "shipping_lines" => array(
              array(
                 "amount" => 1500,
                "carrier" => "FEDEX"
               )
             ), //shipping_lines - physical goods only
            "currency" => "MXN",
            "customer_info" => array(
              "name" => $nombreCliente,
              "email" => $email,
              "phone" => $telefono
            ), //customer_info
            
         "shipping_contact" => array(
          "address" => array(
            "street1" => "Calle 123, int 2",
            "postal_code" => "06100",
            "country" => "MX"
          )//address
        ), //shipping_contact - required only for physical goods
            "metadata" => array( "keyVenta" => "keyVenta"),
            "charges" => array(
              array(
                "payment_method" => array(
                  "type" => "oxxo_cash"
                ) //payment_method - use customer's <code>default</code> - a card
              ) //first charge
            ) //charges
          )//order
        );
        echo json_encode( $order);
      } catch (\Conekta\ProcessingError $error){
         // $error->getMessage();
         $mens=$error->getMessage();
         $error=array(
           "id" => -1,
           "mensaje"=> $mens
         );
         echo json_encode( $error);
      } catch (\Conekta\ParameterValidationError $error){
        $mens=$error->getMessage();
        $estadoError=array(
          "id" => -1,
          "mensaje"=> $mens
        );
        echo json_encode($estadoError);
      } catch (\Conekta\Handler $error){
        $mens=$error->getMessage();
        $estadoError=array(
          "id" => -1,
          "mensaje"=> $mens
        );
        echo json_encode($estadoError);
      }
      # code...
    }






?>
