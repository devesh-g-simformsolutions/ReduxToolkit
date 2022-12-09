//
//  EditContacts.swift
//  ReduxToolkit
//
//  Created by DeveshPuri Goswami on 08/09/1944 Saka.
//

import Foundation
import ContactsUI
import Contacts
import UIKit

@objc(EditContacts)
class EditContacts: NSObject{
  
  var store = CNContactStore()
    
  @objc func fetchContacts(_ resolve: RCTResponseSenderBlock){
    
    let predicate = CNContact.predicateForContactsInContainer(withIdentifier: store.defaultContainerIdentifier())
    let contact = try! store.unifiedContacts(matching: predicate, keysToFetch: [CNContactGivenNameKey as CNKeyDescriptor, CNContactPhoneNumbersKey as CNKeyDescriptor, CNContactFamilyNameKey as CNKeyDescriptor, CNContactFamilyNameKey as CNKeyDescriptor, CNContactPostalAddressesKey as CNKeyDescriptor])
  
        
    let result: NSMutableArray = []
    for item in contact{
      let yourAuxDic: NSMutableDictionary = [:]
      yourAuxDic["name"] = item.givenName + " " + item.familyName
      
      for add in item.postalAddresses{
        yourAuxDic["street"] = add.value.street
        yourAuxDic["city"] = add.value.city
        yourAuxDic["country"] = add.value.country
        yourAuxDic["postalCode"] = add.value.postalCode
        yourAuxDic["state"] = add.value.state
      }
      for num in item.phoneNumbers{
        yourAuxDic["number"] = num.value.stringValue
      }
      result.add(yourAuxDic)
    }
    resolve([result])
    }
  
  @objc func deleteContacts(_ nameToBeDeleted:String, callback:RCTResponseSenderBlock){
    let predicate = CNContact.predicateForContacts(matchingName: nameToBeDeleted);

    do{
      let contacts = try store.unifiedContacts(matching: predicate, keysToFetch: [CNContactGivenNameKey as CNKeyDescriptor])
      guard contacts.count > 0 else{
        print("No contacts found")
        return
      }

      guard let contact = contacts.first else{ return }

      let req = CNSaveRequest()
      let mutableContact = contact.mutableCopy() as! CNMutableContact
      req.delete(mutableContact)

      do{
        try store.execute(req)
        callback([true])
      } catch _{
        callback([false])
      }
    } catch let err{
       print(err)
    }
    
  }
  
  @objc func addUserToContact(_ contactName:String, contactNumber:String, callback:RCTResponseSenderBlock){
    
    let store = CNContactStore()
            let contact = CNMutableContact()

            // Name
            contact.givenName = contactName

            // Phone
            contact.phoneNumbers.append(CNLabeledValue(
              label: "mobile", value: CNPhoneNumber(stringValue: contactNumber )))

            // Save
            let saveRequest = CNSaveRequest()
              saveRequest.add(contact, toContainerWithIdentifier: nil)
            
    
      do{
        try store.execute(saveRequest)
        callback([true])
      } catch _{
        callback([false])
      }
    
  }
  
  @objc func updateContacts(_ contactName: String, contactNumber: String, callback:RCTResponseSenderBlock){
    
    let predicate = CNContact.predicateForContacts(matchingName: contactName);

    do{
      let contacts = try store.unifiedContacts(matching: predicate, keysToFetch: [CNContactPhoneNumbersKey as CNKeyDescriptor])
      guard contacts.count > 0 else{
        print("No contacts found")
        return
      }

      guard let contact = contacts.first else{ return }

      let req = CNSaveRequest()
      
      let newNumber = contact.mutableCopy() as! CNMutableContact


      let newPhoneNumber = CNLabeledValue(
          label:CNLabelPhoneNumberMobile,
          value:CNPhoneNumber(stringValue:contactNumber))

      newNumber.phoneNumbers.removeAll()
      newNumber.phoneNumbers.append(newPhoneNumber)
      
      
      req.update(newNumber)

      do{
        try store.execute(req)
        callback([true])
      } catch _{
        callback([false])
      }
    } catch let err{
       print(err)
    }
  
    }
  
  @objc func dialNumber(_ contactNumber: String) {
    let tPhoneNumber = contactNumber
    if let url = URL(string: "tel://"+tPhoneNumber) {
      DispatchQueue.main.async {
        UIApplication.shared.open(url)
        }
     }
  }
  
  @objc func messageToNumber(_ contactNumber:String, message: String){
    
    let mPhoneNumber = contactNumber
    let mMessage = message.replacingOccurrences(of: " ", with: "%20")
    if let url = URL(string: "sms://"+mPhoneNumber+"&body="+mMessage) {
      DispatchQueue.main.async {
        UIApplication.shared.open(url)
      }
    }
  }
  
  @objc func videoCall(_ contactNumber:String){
      if let facetimeURL:NSURL = NSURL(string: "facetime://\(contactNumber)") {
        let application:UIApplication = UIApplication.shared
        if (application.canOpenURL(facetimeURL as URL)) {
          application.open(facetimeURL as URL);
        }
      }

  }
  
  @objc func addAddress(_ contactName: String, streetName: String,cityName: String, stateName: String, zipCode: String, countryName: String, callback:RCTResponseSenderBlock) {
    
    
    let predicate = CNContact.predicateForContacts(matchingName: contactName);

    do{
      let contacts = try store.unifiedContacts(matching: predicate, keysToFetch: [CNContactPostalAddressesKey as CNKeyDescriptor])
      guard contacts.count > 0 else{
        print("No contacts found")
        return
      }

      guard let contact = contacts.first else{ return }

      let req = CNSaveRequest()
      
      let newAddress = contact.mutableCopy() as! CNMutableContact


      let address = CNMutablePostalAddress()
      address.street = streetName
      address.city = cityName
      address.state = stateName
      address.postalCode = zipCode
      address.country = countryName
      let home = CNLabeledValue<CNPostalAddress>(label:CNLabelHome, value:address)

      newAddress.postalAddresses.removeAll()
      newAddress.postalAddresses.append(home)
      
      
      req.update(newAddress)

      do{
        try store.execute(req)
        callback([true])
      } catch _{
        callback([false])
      }
    } catch let err{
       print(err)
    }
    
    
    
    
    
//    let contact = CNMutableContact()
//    contact.givenName = contactName
//    // Address
//    let address = CNMutablePostalAddress()
//    address.street = streetName
//    address.city = cityName
//    address.state = stateName
//    address.postalCode = zipCode
//    address.country = countryName
//    let home = CNLabeledValue<CNPostalAddress>(label:CNLabelHome, value:address)
//    contact.postalAddresses = [home]
//    // Save
//    let saveRequest = CNSaveRequest()
//    saveRequest.add(contact, toContainerWithIdentifier: nil)
//    try? store.execute(saveRequest)

    

    print(CNMutablePostalAddress().self);
 

  }
}
