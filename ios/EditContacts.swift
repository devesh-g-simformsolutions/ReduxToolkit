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
    let contact = try! store.unifiedContacts(matching: predicate, keysToFetch: [CNContactGivenNameKey as CNKeyDescriptor, CNContactPhoneNumbersKey as CNKeyDescriptor, CNContactFamilyNameKey as CNKeyDescriptor, CNContactFamilyNameKey as CNKeyDescriptor])
  
        
    let result: NSMutableArray = []
    for item in contact{
      let yourAuxDic: NSMutableDictionary = [:]
      yourAuxDic["name"] = item.givenName + " " + item.familyName
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
}
