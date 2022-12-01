//
//  ViewController.swift
//  ReduxToolkit
//
//  Created by DeveshPuri Goswami on 08/09/1944 Saka.
//

import Contacts
import ContactsUI
import UIKit

class ViewController: UIViewController, CNContactPickerDelegate{
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(didTapAdd))
  }
  
@objc func didTapAdd(){
     let vc = CNContactPickerViewController()
     vc.delegate = self
     present(vc, animated: true)
   }
}
