<?php
/**
 *接收客户端提交的did，执行DELETE，删除该详情条目返回{"code":1 }
*/
  header('Content-Type:application/json');
  @$did=$_REQUEST['did'] or die('{"code":2,"msg":"did required"}');
  require('1_init.php');
  $sql="DELETE FROM jd_cart_detail WHERE did=$did";
  mysqli_query($conn,$sql);
  $output=[
    'code'=>1,
  ];
  echo json_encode($output);