package com.ReduxToolkit;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentProviderOperation;
import android.content.OperationApplicationException;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.RemoteException;
import android.provider.ContactsContract;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;

import java.util.ArrayList;

public class CustomModuleAddContact extends MainActivity {

        private EditText editTextName, editTextNumber;

        @SuppressLint("MissingInflatedId")
        @Override
        protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                setContentView(R.layout.custom_module_add_contact);

                ActivityCompat.requestPermissions(this,
                                new String[] { Manifest.permission.WRITE_CONTACTS },
                                PackageManager.PERMISSION_GRANTED);

                editTextName = findViewById(R.id.editTextAddPersonName);
                editTextNumber = findViewById(R.id.editTextAddNumber);
        }

        public void buttonAddContact(View view) {
                ArrayList<ContentProviderOperation> contentProviderOperations = new ArrayList<ContentProviderOperation>();

                contentProviderOperations.add(ContentProviderOperation.newInsert(
                                ContactsContract.RawContacts.CONTENT_URI)
                                .withValue(ContactsContract.RawContacts.ACCOUNT_TYPE, null)
                                .withValue(ContactsContract.RawContacts.ACCOUNT_NAME, null)
                                .build());

                // Adding Name
                contentProviderOperations.add(ContentProviderOperation
                                .newInsert(ContactsContract.Data.CONTENT_URI)
                                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                                .withValue(ContactsContract.Data.MIMETYPE,
                                                ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE)
                                .withValue(ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME,
                                                editTextName.getText().toString())
                                .build());

                // Adding Number
                contentProviderOperations.add(ContentProviderOperation
                                .newInsert(ContactsContract.Data.CONTENT_URI)
                                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                                .withValue(ContactsContract.Data.MIMETYPE,
                                                ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE)
                                .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER,
                                                editTextNumber.getText().toString())
                                .withValue(ContactsContract.CommonDataKinds.Phone.TYPE,
                                                ContactsContract.CommonDataKinds.Phone.TYPE_WORK)
                                .build());

                try {
                        getContentResolver().applyBatch(ContactsContract.AUTHORITY, contentProviderOperations);
                        Toast.makeText(this, "CONTACT ADD SUCCESSFULLY", Toast.LENGTH_LONG).show();
                } catch (OperationApplicationException e) {
                        e.printStackTrace();
                } catch (RemoteException e) {
                        e.printStackTrace();
                }
        }

}
