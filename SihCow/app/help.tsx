import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';

export default function HelpScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const goBack = () => {
    router.back();
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:18001234567');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bpa.gov.in');
  };

  const handleFAQPress = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "फोटो कैसे लें? • How to take photo?",
      answer: "फोटो लेने के लिए:\n\n1. 'Capture Animal Photo' बटन दबाएं\n2. पशु को कैमरे के सेंटर में रखें\n3. दिन की रोशनी में साफ फोटो लें\n4. पशु का चेहरा और शरीर दोनों दिखना चाहिए\n5. ब्लर या अंधेरी फोटो से बचें\n\nFor taking photos:\n\n1. Press 'Capture Animal Photo' button\n2. Keep animal in center of camera\n3. Take clear photos in daylight\n4. Both face and body should be visible\n5. Avoid blurry or dark photos"
    },
    {
      question: "कौन सी नस्लें समर्थित हैं? • Which breeds are supported?",
      answer: "समर्थित नस्लें:\n\nगाय (Cattle):\n• गीर, साहीवाल, रेड सिंधी, थारपारकर\n• कंकरेज, ओंगोल, हरियाणा, अमृतमहल\n• बारगुर, कंगायम, देवनी, दांगी\n\nभैंस (Buffalo):\n• मुर्राह, जाफराबादी, सूरती\n• मेहसाणा, नीली-रवी, भदावरी\n\nSupported Breeds:\n\nCattle:\n• Gir, Sahiwal, Red Sindhi, Tharparkar\n• Kankrej, Ongole, Hariana, Amritmahal\n• Bargur, Kangayam, Deoni, Dangi\n\nBuffalo:\n• Murrah, Jaffarabadi, Surti\n• Mehsana, Nili-Ravi, Bhadawari"
    },
    {
      question: "AI की सटीकता कितनी है? • How accurate is AI?",
      answer: "AI सटीकता:\n\n• औसत सटीकता: 85-95%\n• अच्छी फोटो के लिए: 90%+\n• ब्लर फोटो के लिए: 70-80%\n• नई नस्लों के लिए: 80-85%\n\nसुधार के लिए:\n• बेहतर फोटो लें\n• सही कोण से फोटो लें\n• अच्छी रोशनी में फोटो लें\n\nAI Accuracy:\n\n• Average accuracy: 85-95%\n• For good photos: 90%+\n• For blurry photos: 70-80%\n• For new breeds: 80-85%\n\nFor improvement:\n• Take better photos\n• Photograph from correct angle\n• Take photos in good lighting"
    },
    {
      question: "ऑफलाइन मोड कैसे काम करता है? • How does offline mode work?",
      answer: "ऑफलाइन मोड:\n\n• पहले से डाउनलोड किए गए डेटा का उपयोग\n• इंटरनेट कनेक्शन की आवश्यकता नहीं\n• सीमित नस्लों की पहचान\n• बाद में सिंक करने की सुविधा\n\nलाभ:\n• ग्रामीण क्षेत्रों में काम करता है\n• तेज़ प्रतिक्रिया\n• डेटा बचत\n\nOffline Mode:\n\n• Uses pre-downloaded data\n• No internet connection required\n• Limited breed identification\n• Sync later facility\n\nBenefits:\n• Works in rural areas\n• Fast response\n• Data saving"
    },
    {
      question: "डेटा कहाँ जाता है? • Where does data go?",
      answer: "डेटा सुरक्षा:\n\n• सभी डेटा भारत सरकार के सर्वर पर सुरक्षित\n• BPA (Breed Protection Authority) द्वारा प्रबंधित\n• GDPR और भारतीय डेटा सुरक्षा कानूनों का पालन\n• एन्क्रिप्टेड स्टोरेज और ट्रांसमिशन\n\nडेटा उपयोग:\n• केवल नस्ल पहचान के लिए\n• अनुसंधान और विकास\n• सरकारी नीति निर्माण\n• व्यक्तिगत जानकारी सुरक्षित\n\nData Security:\n\n• All data secured on Government of India servers\n• Managed by BPA (Breed Protection Authority)\n• Compliant with GDPR and Indian data protection laws\n• Encrypted storage and transmission\n\nData Usage:\n• Only for breed identification\n• Research and development\n• Government policy making\n• Personal information protected"
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>सहायता • Help & Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* How to Use Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#28a745" />
              <Text style={styles.sectionTitle}>उपयोग कैसे करें • How to Use</Text>
            </View>
            
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Ionicons name="camera" size={24} color="#28a745" style={styles.stepIcon} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>फोटो लें • Take Photo</Text>
                  <Text style={styles.stepDescription}>
                    "Capture Animal Photo" बटन दबाएं और पशु की साफ तस्वीर लें
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Ionicons name="search" size={24} color="#28a745" style={styles.stepIcon} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>AI विश्लेषण • AI Analysis</Text>
                  <Text style={styles.stepDescription}>
                    AI नस्ल की पहचान करेगा और विश्वसनीयता बताएगा
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Ionicons name="checkmark-sharp" size={24} color="#28a745" style={styles.stepIcon} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>पुष्टि करें • Confirm</Text>
                  <Text style={styles.stepDescription}>
                    नस्ल की पुष्टि करें या अलग नस्ल चुनें
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Ionicons name="create" size={24} color="#28a745" style={styles.stepIcon} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>पंजीकरण • Registration</Text>
                  <Text style={styles.stepDescription}>
                    विवरण भरें और BPA में सेव करें
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Photography Tips Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="camera" size={20} color="#007bff" />
              <Text style={styles.sectionTitle}>फोटो टिप्स • Photography Tips</Text>
            </View>
            
            <View style={styles.tipsContainer}>
              <View style={styles.tip}>
                <Ionicons name="sunny" size={20} color="#ffc107" />
                <Text style={styles.tipText}>दिन की रोशनी में फोटो लें • Take photos in daylight</Text>
              </View>
              
              <View style={styles.tip}>
                <Ionicons name="triangle" size={20} color="#ffc107" />
                <Text style={styles.tipText}>साइड प्रोफाइल या पूरा शरीर दिखाएं • Show side profile or full body</Text>
              </View>
              
              <View style={styles.tip}>
                <Ionicons name="radio-button-on" size={20} color="#ffc107" />
                <Text style={styles.tipText}>पशु को केंद्र में रखें • Keep animal in center</Text>
              </View>
              
              <View style={styles.tip}>
                <Ionicons name="search" size={20} color="#ffc107" />
                <Text style={styles.tipText}>चेहरा और शरीर साफ दिखना चाहिए • Face and body should be clearly visible</Text>
              </View>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="help-circle" size={20} color="#ff9800" />
              <Text style={styles.sectionTitle}>अक्सर पूछे जाने वाले प्रश्न • FAQ</Text>
            </View>
            
            <View style={styles.faqContainer}>
              {faqData.map((faq, index) => (
                <View key={index} style={styles.faqItemContainer}>
                  <TouchableOpacity 
                    style={styles.faqItem} 
                    onPress={() => handleFAQPress(index)}
                  >
                    <Text style={styles.faqText}>{faq.question}</Text>
                    <Ionicons 
                      name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {expandedFAQ === index && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Contact Support Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color="#9c27b0" />
              <Text style={styles.sectionTitle}>संपर्क सहायता • Contact Support</Text>
            </View>
            
            <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
              <Ionicons name="call" size={20} color="#fff" />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>फोन करें • Call Support</Text>
                <Text style={styles.contactSubtitle}>1800-123-4567 (टोल फ्री • Toll Free)</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactButton, styles.emailButton]} onPress={handleEmailSupport}>
              <Ionicons name="mail" size={20} color="#fff" />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>ईमेल भेजें • Send Email</Text>
                <Text style={styles.contactSubtitle}>support@bpa.gov.in</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Government Support Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.sectionTitle}>सरकारी सहायता • Government Support</Text>
            </View>
            
            <View style={styles.governmentInfo}>
              <Text style={styles.governmentText}>भारत सरकार • Government of India</Text>
              <Text style={styles.governmentText}>पशुपालन और डेयरी विभाग • Department of Animal Husbandry & Dairying</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsContainer: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  faqContainer: {
    gap: 8,
  },
  faqItemContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  faqText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    fontWeight: '500',
  },
  faqAnswerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  emailButton: {
    backgroundColor: '#007bff',
  },
  contactContent: {
    marginLeft: 12,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  governmentInfo: {
    gap: 8,
  },
  governmentText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

