'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { updateEvent, deleteEvent } from '../../../_services/events';
import { useEvent } from '../../../_hooks';
import { Input } from '../../../_components/form/Input';
import { Textarea } from '../../../_components/form/Textarea';
import { Button } from '../../../_components/Button';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';

function SettingsContent() {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const { event, loading, error, eventId } = useEvent();

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description || '',
      });
    }
  }, [event]);

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await updateEvent(eventId, formData);
    } catch (err) {
      console.error('Failed to update event:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(eventId);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to delete event:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-nory-white rounded-card p-6 mb-6">
        <h2 className="text-card-title text-nory-black font-grotesk mb-4">
          {t('events.editEvent.title', 'Rediger begivenhed')}
        </h2>

        <Input
          label={t('events.editEvent.fields.name', 'Navn')}
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          fullWidth
        />

        <Textarea
          label={t('events.editEvent.fields.description', 'Beskrivelse')}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={4}
          fullWidth
        />

        <Button
          onClick={handleSave}
          loading={saving}
          disabled={!formData.name.trim()}
        >
          {t('events.editEvent.saveChanges', 'Gem ændringer')}
        </Button>
      </div>

      <div className="bg-nory-white rounded-card p-6 border-2 border-red-200">
        <h2 className="text-card-title text-red-600 font-grotesk mb-2">
          {t('settings.dangerZone', 'Farezone')}
        </h2>
        <p className="text-body text-nory-muted font-grotesk mb-4">
          {t('settings.deleteWarning', 'Sletning af begivenheden kan ikke fortrydes. Alle billeder og data vil blive slettet permanent.')}
        </p>

        {showDeleteConfirm ? (
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              {t('settings.confirmDelete', 'Ja, slet begivenheden')}
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              {t('common.cancel', 'Annuller')}
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            {t('settings.deleteEvent', 'Slet begivenhed')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function EventSettingsPage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="settings">
        <SettingsContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
